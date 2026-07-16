import axios from 'axios';

// Module-level in-memory storage for the access token
let memoryToken = null;
let refreshSubscribers = [];
let isRefreshing = false;

// Event emitter to notify listeners of auth state changes (e.g. logouts on failure)
let onLogoutCallback = null;

export const setAccessToken = (token) => {
  memoryToken = token;
};

export const getAccessToken = () => {
  return memoryToken;
};

export const registerOnLogout = (callback) => {
  onLogoutCallback = callback;
};

// Create standard axios instance
export const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for receiving HttpOnly Refresh Cookies
});

// Request Interceptor: Attach in-memory Access Token to header
authClient.interceptors.request.use(
  (config) => {
    if (memoryToken) {
      config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401s, run transparent token refresh
authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard: Only handle 401 errors, and don't retry refresh requests itself
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for the ongoing refresh process to finish and retry
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(authClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // Call refresh token endpoint
        const response = await authClient.post('/api/auth/refresh');
        const newToken = response.data.accessToken;

        setAccessToken(newToken);
        isRefreshing = false;

        // Execute all waiting requests with the new token
        refreshSubscribers.forEach((callback) => callback(newToken));
        refreshSubscribers = [];

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return authClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        memoryToken = null;

        // Trigger global logout (clears context)
        if (onLogoutCallback) {
          onLogoutCallback();
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// --- DEVELOPMENT MOCK INTERCEPTOR ---
// Allows complete frontend demo behavior without a live backend.
// To enable this, set VITE_USE_MOCK_API=true in your .env file.
if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true') {
  // Simple in-memory mock backend state
  let mockHasCookie = false; // Simulates the HttpOnly refresh cookie existence
  let mockUsers = [
    { username: 'grandmaster', email: 'gm@chess.com', password: 'Password123!' }
  ];

  authClient.interceptors.request.use(async (config) => {
    // Intercept API calls and simulate responses
    const url = config.url || '';

    // Delay helper to mock network latency
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(600);

    if (url.includes('/api/auth/login')) {
      const { usernameOrEmail, password } = JSON.parse(config.data);

      if (usernameOrEmail === 'locked') {
        throw {
          response: {
            status: 403,
            data: { message: 'Your tournament account has been locked. Contact administration.' }
          }
        };
      }

      const matchedUser = mockUsers.find(
        (u) => (u.username === usernameOrEmail || u.email === usernameOrEmail)
      );

      if (!matchedUser || password !== matchedUser.password) {
        throw {
          response: {
            status: 401,
            data: { message: 'Checkmate. Invalid tournament credentials.' }
          }
        };
      }

      // Success
      mockHasCookie = true;
      const responseData = {
        accessToken: `mock_jwt_access_${Date.now()}`,
        user: {
          id: 'u1',
          username: matchedUser.username,
          email: matchedUser.email,
          rank: 'Grandmaster'
        }
      };

      return {
        data: responseData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    if (url.includes('/api/auth/register')) {
      const { username, email, password } = JSON.parse(config.data);

      const existsUsername = mockUsers.some((u) => u.username.toLowerCase() === username.toLowerCase());
      if (existsUsername) {
        throw {
          response: {
            status: 409,
            data: { message: 'Username is already taken by another player.' }
          }
        };
      }

      const existsEmail = mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existsEmail) {
        throw {
          response: {
            status: 409,
            data: { message: 'Email address is already registered.' }
          }
        };
      }

      // Add mock user to state
      mockUsers.push({ username, email, password });

      return {
        data: { message: 'Registration successful! Draw your pieces and prepare for battle.' },
        status: 201,
        statusText: 'Created',
        headers: {},
        config
      };
    }

    if (url.includes('/api/auth/refresh')) {
      if (!mockHasCookie) {
        throw {
          response: {
            status: 401,
            data: { message: 'Refresh token expired or invalid.' }
          }
        };
      }

      // Return refreshed token
      return {
        data: {
          accessToken: `mock_jwt_access_refreshed_${Date.now()}`
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    if (url.includes('/api/auth/logout')) {
      mockHasCookie = false;
      return {
        data: { message: 'Logged out successfully.' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    // Default: let other requests fall through (or mock simple protected data)
    if (url.includes('/api/protected/profile')) {
      if (!config.headers.Authorization) {
        throw {
          response: {
            status: 401,
            data: { message: 'Unauthorized. Access token is missing.' }
          }
        };
      }
      return {
        data: {
          message: 'Welcome to the inner circle of Grandmasters.',
          rating: 2450,
          stats: { wins: 142, draws: 32, losses: 12 }
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    return config;
  }, (error) => Promise.reject(error));
}
