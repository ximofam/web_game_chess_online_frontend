import { authClient } from '../../auth/api/authClient';

/**
 * Service to interface with Notification backend API endpoints.
 */
export const notificationService = {
  /**
   * Fetch paginated list of notifications.
   * @param {number} [page=0] Zero-indexed page number
   * @param {number} [size=20] Number of records per page
   * @returns {Promise<{ content: Array, last: boolean, totalElements: number }>}
   */
  getNotifications: async (page = 0, size = 20) => {
    const response = await authClient.get(`/api/notifications?page=${page}&size=${size}`);
    return response.data;
  },

  /**
   * Fetch unread notification counts.
   * @returns {Promise<{ count: number }>}
   */
  getUnreadCount: async () => {
    const response = await authClient.get('/api/notifications/unread-count');
    return response.data;
  },

  /**
   * Mark a single notification as read.
   * @param {number|string} id The notification ID
   * @returns {Promise<void>}
   */
  markRead: async (id) => {
    await authClient.patch(`/api/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read.
   * @returns {Promise<void>}
   */
  markAllRead: async () => {
    await authClient.patch('/api/notifications/read-all');
  },

  /**
   * Delete a single notification.
   * @param {number|string} id The notification ID
   * @returns {Promise<void>}
   */
  deleteNotification: async (id) => {
    await authClient.delete(`/api/notifications/${id}`);
  },

  /**
   * Delete all notifications (clear history).
   * @returns {Promise<void>}
   */
  deleteAll: async () => {
    await authClient.delete('/api/notifications');
  }
};

export default notificationService;
