import { authClient } from '../../auth/api/authClient';

export const presenceService = {
  getOnlineCount: async () => {
    const response = await authClient.get('/api/presence/online-count');
    return response.data;
  },
  getUserPresence: async (userId) => {
    const response = await authClient.get(`/api/presence/${userId}`);
    return response.data;
  }
};
