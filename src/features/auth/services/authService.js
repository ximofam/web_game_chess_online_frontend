import { authClient } from '../api/authClient';
import { setGuestToken, getGuestToken } from '../../../shared/utils/guestToken';

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
    if (response.data?.guestToken) {
      setGuestToken(response.data.guestToken);
    }
    return response.data;
  },

  /**
   * Login as guest using guestToken cookie or fallback from localStorage → returns accessToken.
   */
  loginGuest: async () => {
    const payload = {};
    const guestToken = getGuestToken();
    if (guestToken) {
      payload.guestToken = guestToken;
    }
    const response = await authClient.post('/api/auth/login/guest', payload);
    return response.data;
  },

  refreshGuestToken: async () => {
    const payload = {};
    const guestToken = getGuestToken();
    if (guestToken) {
      payload.guestToken = guestToken;
    }
    const response = await authClient.post('/api/auth/refresh/guest-token', payload);
    if (response.data?.guestToken) {
      setGuestToken(response.data.guestToken);
    }
    return response.data;
  },

  getProfile: async () => {
    const response = await authClient.get('/api/protected/profile');
    return response.data;
  }
};

