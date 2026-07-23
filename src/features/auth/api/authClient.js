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
  let mockProfileDb = {
    'grandmaster': {
      id: 1,
      username: 'grandmaster',
      email: 'gm@chess.com',
      avatarUrl: null,
      role: 'USER',
      profile: {
        fullName: 'Grandmaster Chess',
        gender: 'MALE',
        dateOfBirth: '16/07/2000'
      }
    }
  };
  let currentMockUsername = 'grandmaster';

  let mockNotificationsDb = [
    {
      id: 1,
      sender: {
        id: 2,
        username: "magnus_c",
        avatarUrl: null
      },
      type: "ROOM_INVITE",
      title: "Friendly Arena Invite",
      message: "Magnus Carlsen invited you to join Chess Room #99.",
      metadata: {
        roomId: 99
      },
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      read: false
    },
    {
      id: 2,
      sender: {
        id: 3,
        username: "hikaru_n",
        avatarUrl: null
      },
      type: "POST_LIKE",
      title: "New Like",
      message: "Hikaru Nakamura liked your game analysis post.",
      metadata: {
        postId: 42
      },
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      read: true
    },
    {
      id: 3,
      sender: {
        id: 4,
        username: "garry_k",
        avatarUrl: null
      },
      type: "FOLLOW",
      title: "New Follower",
      message: "Garry Kasparov started following your profile.",
      metadata: {},
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      read: true
    }
  ];

  let mockRoomsDb = [
    {
      roomId: 'room-blitz-101',
      name: 'Giao lưu Cờ Chớp Blitz 3m+2s',
      host: { id: 2, username: 'magnus_c', avatarUrl: null },
      createdAt: Date.now() - 300000,
      settings: { timeMinutes: 3, incrementSeconds: 2, variant: 'STANDARD', rated: true, isPrivate: false },
      white: { id: 2, username: 'magnus_c', avatarUrl: null },
      black: null,
      status: 'WAITING'
    },
    {
      roomId: 'room-rapid-102',
      name: 'Thách Đấu Cờ Nhanh 10m',
      host: { id: 3, username: 'hikaru_n', avatarUrl: null },
      createdAt: Date.now() - 600000,
      settings: { timeMinutes: 10, incrementSeconds: 0, variant: 'STANDARD', rated: false, isPrivate: false },
      white: { id: 3, username: 'hikaru_n', avatarUrl: null },
      black: { id: 4, username: 'garry_k', avatarUrl: null },
      status: 'IN_PROGRESS'
    },
    {
      roomId: 'room-bullet-103',
      name: 'Phòng luyện tập tân thủ',
      host: { id: 5, username: 'chess_fan_99', avatarUrl: null },
      createdAt: Date.now() - 120000,
      settings: { timeMinutes: 5, incrementSeconds: 3, variant: 'STANDARD', rated: false, isPrivate: false },
      white: { id: 5, username: 'chess_fan_99', avatarUrl: null },
      black: null,
      status: 'WAITING'
    }
  ];

  if (typeof window !== 'undefined') {
    window.mockNotificationsDb = mockNotificationsDb;
    window.mockRoomsDb = mockRoomsDb;
  }


  authClient.interceptors.request.use(async (config) => {
    // Intercept API calls and simulate responses
    const url = config.url || '';

    // Delay helper to mock network latency
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(600);

    if (url.includes('/api/auth/register/guest')) {
      return {
        data: null,
        status: 201,
        statusText: 'Created',
        headers: {},
        config
      };
    }

    if (url.includes('/api/auth/login/guest')) {
      mockHasCookie = true;
      const guestId = Math.floor(1000 + Math.random() * 9000);
      const guestUser = {
        id: `guest_${guestId}`,
        username: `Guest_${guestId}`,
        email: null,
        avatarUrl: null,
        role: 'GUEST',
        isGuest: true,
        profile: { fullName: `Khách ${guestId}`, gender: 'SECRET', dateOfBirth: '' }
      };
      return {
        data: {
          accessToken: `mock_jwt_guest_access_${Date.now()}`,
          refreshToken: `mock_jwt_guest_refresh_${Date.now()}`,
          user: guestUser
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    if (url.includes('/api/auth/refresh/guest-token')) {
      return {
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

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
      currentMockUsername = matchedUser.username;

      if (!mockProfileDb[currentMockUsername]) {
        mockProfileDb[currentMockUsername] = {
          id: mockUsers.indexOf(matchedUser) + 1,
          username: matchedUser.username,
          email: matchedUser.email,
          avatarUrl: null,
          role: 'USER',
          profile: {
            fullName: matchedUser.username === 'grandmaster' ? 'Grandmaster Chess' : '',
            gender: 'MALE',
            dateOfBirth: '16/07/2000'
          }
        };
      }

      const responseData = {
        accessToken: `mock_jwt_access_${Date.now()}`,
        user: mockProfileDb[currentMockUsername]
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

    // Mock endpoints for User Profile
    if (url.includes('/api/users/me/avatar') && config.method === 'patch') {
      if (!mockHasCookie) {
        throw {
          response: {
            status: 401,
            data: { message: 'Unauthorized. Please log in again.' }
          }
        };
      }

      let mockUrl = 'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=200&h=200&fit=crop';
      if (config.data && typeof config.data.get === 'function') {
        const file = config.data.get('file');
        if (file) {
          try {
            mockUrl = URL.createObjectURL(file);
          } catch (e) {
            console.warn('Failed to create object URL for file, using default mock image', e);
          }
        }
      }

      const userProfile = mockProfileDb[currentMockUsername];
      if (userProfile) {
        userProfile.avatarUrl = mockUrl;
      }

      return {
        data: { avatarUrl: mockUrl },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    if (url.includes('/api/users/me') && config.method === 'patch') {
      if (!mockHasCookie) {
        throw {
          response: {
            status: 401,
            data: { message: 'Unauthorized. Please log in again.' }
          }
        };
      }
      const updateData = JSON.parse(config.data);
      const userProfile = mockProfileDb[currentMockUsername];
      if (userProfile) {
        userProfile.profile = {
          ...userProfile.profile,
          ...updateData
        };
      }
      return {
        data: userProfile,
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    if (url.includes('/api/users/me') && config.method === 'get') {
      if (!mockHasCookie) {
        throw {
          response: {
            status: 401,
            data: { message: 'Unauthorized. Please log in again.' }
          }
        };
      }
      const profile = mockProfileDb[currentMockUsername] || {
        id: 99,
        username: currentMockUsername,
        email: `${currentMockUsername}@example.com`,
        avatarUrl: null,
        role: 'USER',
        profile: { fullName: '', gender: 'MALE', dateOfBirth: '01/01/2000' }
      };
      return {
        data: profile,
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    // Mock endpoints for Notifications
    if (url.includes('/api/notifications/unread-count') && config.method === 'get') {
      if (!mockHasCookie) {
        throw {
          response: {
            status: 401,
            data: { message: 'Unauthorized. Please log in again.' }
          }
        };
      }
      const list = window.mockNotificationsDb || [];
      const count = list.filter(n => !n.read).length;
      return {
        data: { count },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    if (url.includes('/api/notifications/read-all') && config.method === 'patch') {
      if (!mockHasCookie) {
        throw {
          response: {
            status: 401,
            data: { message: 'Unauthorized. Please log in again.' }
          }
        };
      }
      const list = window.mockNotificationsDb || [];
      list.forEach(n => { n.read = true; });
      return {
        data: null,
        status: 204,
        statusText: 'No Content',
        headers: {},
        config
      };
    }

    const readMatch = url.match(/\/api\/notifications\/(\d+)\/read/);
    if (readMatch && config.method === 'patch') {
      if (!mockHasCookie) {
        throw {
          response: {
            status: 401,
            data: { message: 'Unauthorized. Please log in again.' }
          }
        };
      }
      const id = parseInt(readMatch[1], 10);
      const list = window.mockNotificationsDb || [];
      const notif = list.find(n => n.id === id);
      if (notif) {
        notif.read = true;
      }
      return {
        data: null,
        status: 204,
        statusText: 'No Content',
        headers: {},
        config
      };
    }

    const deleteMatch = url.match(/\/api\/notifications\/(\d+)$/);
    if (deleteMatch && config.method === 'delete') {
      if (!mockHasCookie) {
        throw {
          response: {
            status: 401,
            data: { message: 'Unauthorized. Please log in again.' }
          }
        };
      }
      const id = parseInt(deleteMatch[1], 10);
      if (window.mockNotificationsDb) {
        window.mockNotificationsDb = window.mockNotificationsDb.filter(n => n.id !== id);
      }
      return {
        data: null,
        status: 204,
        statusText: 'No Content',
        headers: {},
        config
      };
    }

    if (url.includes('/api/notifications') && config.method === 'delete') {
      if (!mockHasCookie) {
        throw {
          response: {
            status: 401,
            data: { message: 'Unauthorized. Please log in again.' }
          }
        };
      }
      window.mockNotificationsDb = [];
      return {
        data: null,
        status: 204,
        statusText: 'No Content',
        headers: {},
        config
      };
    }

    if (url.includes('/api/notifications') && config.method === 'get') {
      if (!mockHasCookie) {
        throw {
          response: {
            status: 401,
            data: { message: 'Unauthorized. Please log in again.' }
          }
        };
      }
      const params = new URLSearchParams(url.split('?')[1] || '');
      const page = parseInt(params.get('page') || '0', 10);
      const size = parseInt(params.get('size') || '20', 10);

      const list = window.mockNotificationsDb || [];
      const sorted = [...list].sort((a, b) => b.id - a.id);
      const startIdx = page * size;
      const endIdx = startIdx + size;
      const paginatedItems = sorted.slice(startIdx, endIdx);

      return {
        data: {
          content: paginatedItems,
          pageable: { pageNumber: page, pageSize: size },
          totalElements: list.length,
          last: endIdx >= list.length
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    // Mock endpoints for Rooms / Lobby
    if (url.includes('/api/rooms') && config.method === 'post') {
      const body = JSON.parse(config.data || '{}');
      const roomId = `room-${Date.now().toString(36)}`;
      const currentProfile = mockProfileDb[currentMockUsername] || { id: 1, username: 'player1' };
      const newRoom = {
        roomId,
        name: body.name || 'Phòng cờ mới',
        host: { id: currentProfile.id, username: currentProfile.username, avatarUrl: currentProfile.avatarUrl },
        createdAt: Date.now(),
        settings: {
          timeMinutes: body.settings?.timeMinutes || 5,
          incrementSeconds: body.settings?.incrementSeconds || 3,
          variant: body.settings?.variant || 'STANDARD',
          rated: !!body.settings?.rated,
          isPrivate: !!body.settings?.isPrivate
        },
        white: { id: currentProfile.id, username: currentProfile.username, avatarUrl: currentProfile.avatarUrl },
        black: null,
        status: 'WAITING'
      };

      if (window.mockRoomsDb) {
        window.mockRoomsDb.unshift(newRoom);
      }

      // Broadcast STOMP event to /topic/lobbies subscribers
      if (window.mockSocketManager) {
        window.mockSocketManager.broadcast('/topic/lobbies', JSON.stringify({
          type: 'ROOM_CREATED',
          data: newRoom
        }));
      }

      return {
        data: { roomId },
        status: 201,
        statusText: 'Created',
        headers: {},
        config
      };
    }

    if (url.includes('/api/rooms') && config.method === 'get') {
      const rooms = window.mockRoomsDb || [];
      return {
        data: rooms,
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
