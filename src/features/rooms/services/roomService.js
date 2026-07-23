import { authClient } from '../../auth/api/authClient';

/**
 * Service API cho Quản lý Phòng chơi (Rooms & Lobby)
 */
export const roomService = {
  /**
   * Lấy danh sách phòng chơi đang có ở sảnh (Lobby)
   * GET /api/rooms?page=0&size=20
   */
  getRooms: async (page = 0, size = 20) => {
    const response = await authClient.get('/api/rooms', {
      params: { page, size },
    });
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
};
