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

const rawApiUrl = import.meta.env.VITE_API_URL || '';
const formatApiUrl = (url) => {
  if (!url || url.trim() === '' || url.trim() === '/') return '';
  if (/^https?:\/\//i.test(url)) return url;
  return url.startsWith('localhost') || url.startsWith('127.0.0.1') ? `http://${url}` : `https://${url}`;
};
export const API_BASE_URL = formatApiUrl(rawApiUrl);

// Create standard axios instance
export const authClient = axios.create({
  baseURL: API_BASE_URL,
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

export const refreshToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshSubscribers.push((newToken) => {
        if (newToken) resolve(newToken);
        else reject(new Error('Refresh failed'));
      });
    });
  }

  isRefreshing = true;

  try {
    const response = await authClient.post('/api/auth/refresh');
    const newToken = response.data.accessToken;

    setAccessToken(newToken);
    isRefreshing = false;

    // Execute all waiting requests with the new token
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];

    return newToken;
  } catch (refreshError) {
    isRefreshing = false;
    refreshSubscribers.forEach((callback) => callback(null));
    refreshSubscribers = [];
    memoryToken = null;

    // Trigger global logout (clears context)
    if (onLogoutCallback) {
      onLogoutCallback();
    }

    throw refreshError;
  }
};

// Response Interceptor: Catch 401s, run transparent token refresh
authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard: Only handle 401 errors, and don't retry refresh requests itself
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return authClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      window.dispatchEvent(new Event('api:403'));
    }

    if (error.response?.status === 404) {
      window.dispatchEvent(new Event('api:404'));
    }

    return Promise.reject(error);
  }
);
