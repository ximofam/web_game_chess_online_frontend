import { authClient } from '../api/authClient';

/**
 * Authentication service communicating with the backend auth endpoints.
 */
export const authService = {
  /**
   * Logs a user in with username/email and password.
   * @param {string} usernameOrEmail
   * @param {string} password
   * @returns {Promise<{accessToken: string, user: object}>}
   */
  login: async (usernameOrEmail, password) => {
    const response = await authClient.post('/api/auth/login', { usernameOrEmail, password });
    return response.data;
  },

  /**
   * Registers a new user player.
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{message: string}>}
   */
  register: async (username, email, password) => {
    const response = await authClient.post('/api/auth/register', { username, email, password });
    return response.data;
  },

  /**
   * Logs the current user session out.
   * @returns {Promise<{message: string}>}
   */
  logout: async () => {
    const response = await authClient.post('/api/auth/logout');
    return response.data;
  },

  /**
   * Explicitly triggers access token refresh using HTTP-only cookie.
   * @returns {Promise<{accessToken: string}>}
   */
  refresh: async () => {
    const response = await authClient.post('/api/auth/refresh');
    return response.data;
  },

  /**
   * Fetch details of the player's profile (for testing protected routes)
   * @returns {Promise<object>}
   */
  getProfile: async () => {
    const response = await authClient.get('/api/protected/profile');
    return response.data;
  }
};
