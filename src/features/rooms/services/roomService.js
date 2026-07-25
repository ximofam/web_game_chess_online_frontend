import { authClient } from '../../auth/api/authClient';

/**
 * Service API cho Quản lý Phòng chơi (Rooms & Lobby)
 */
export const roomService = {
  /**
   * Lấy danh sách phòng chơi đang có ở sảnh (Lobby)
   * GET /api/rooms?page=0&size=20&q=...
   */
  getRooms: async (page = 0, size = 20, q = '') => {
    const params = { page, size };
    if (q) params.q = q;
    const response = await authClient.get('/api/rooms', { params });
    return response.data;
  },

  /**
   * Tạo phòng mới
   * POST /api/rooms
   * Body: { name, settings: { timeMinutes, incrementSeconds, variant, rated, isPrivate } }
   */
  createRoom: async (roomData) => {
    const response = await authClient.post('/api/rooms', roomData);
    return response.data;
  },

  /**
   * Tham gia phòng chơi (Dự phòng)
   * POST /api/rooms/:roomId/join
   */
  joinRoom: async (roomId, side = 'ANY') => {
    const response = await authClient.post(`/api/rooms/${roomId}/join`, { side });
    return response.data;
  },

  /**
   * Lấy chi tiết thông tin một phòng chơi
   * GET /api/rooms/:roomId
   */
  getRoomDetails: async (roomId) => {
    const response = await authClient.get(`/api/rooms/${roomId}`);
    return response.data;
  },
};

