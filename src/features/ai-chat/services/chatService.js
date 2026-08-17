import { aiClient } from '../api/aiClient';

export const chatService = {
  /**
   * Create a new chat session.
   * @returns {Promise<{ session_id: string }>}
   */
  createChatSession: async () => {
    const response = await aiClient.post('/api/chat/sessions');
    return response.data;
  },

  /**
   * List chat sessions with pagination.
   * @param {Object} params - Query parameters.
   * @param {number} params.page - The page number (default: 1).
   * @param {number} params.size - The page size (default: 20).
   * @returns {Promise<{ items: Array, total: number, page: number, size: number }>}
   */
  listChatSessions: async ({ page = 1, size = 20 } = {}) => {
    const response = await aiClient.get('/api/chat/sessions', {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get messages for a specific session.
   * @param {string} sessionId - The session ID.
   * @returns {Promise<{ items: Array }>}
   */
  getChatMessages: async (sessionId) => {
    const response = await aiClient.get(`/api/chat/${sessionId}/messages`);
    return response.data;
  },

  /**
   * Send a chat message in a specific session.
   * @param {string} sessionId - The session ID.
   * @param {string} question - The user's question.
   * @returns {Promise<{ answer: string, question_type: string }>}
   */
  sendChatMessage: async (sessionId, question) => {
    const response = await aiClient.post(`/api/chat/${sessionId}`, { question });
    return response.data;
  },
};
