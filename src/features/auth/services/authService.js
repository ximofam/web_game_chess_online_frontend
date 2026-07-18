import { authClient } from '../api/authClient';

/**
 * Authentication service communicating with the backend auth endpoints.
 */
export const authService = {
  login: async (usernameOrEmail, password) => {
    const response = await authClient.post('/api/auth/login', { usernameOrEmail, password });
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await authClient.post('/api/auth/register', { username, email, password });
    return response.data;
  },

  logout: async () => {
    const response = await authClient.post('/api/auth/logout');
    return response.data;
  },

  refresh: async () => {
    const response = await authClient.post('/api/auth/refresh');
    return response.data;
  },

  /**
   * Register as anonymous guest (sets guestToken cookie if not present).
   * Safe to call repeatedly — server returns 200 if cookie already valid.
   */
  registerGuest: async () => {
    const response = await authClient.post('/api/auth/register/guest');
    return response.data;
  },

  /**
   * Login as guest using guestToken cookie → returns accessToken.
   */
  loginGuest: async () => {
    const response = await authClient.post('/api/auth/login/guest');
    return response.data;
  },

  refreshGuestToken: async () => {
    const response = await authClient.post('/api/auth/refresh/guest-token');
    return response.data;
  },

  getProfile: async () => {
    const response = await authClient.get('/api/protected/profile');
    return response.data;
  }
};

