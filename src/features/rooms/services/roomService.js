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
   * Tham gia phòng chơi
   * POST /api/rooms/:roomId/join
   * Body: { role: "white" | "black" | "spectator" }
   */
  joinRoom: async (roomId, role = 'black') => {
    const response = await authClient.post(`/api/rooms/${roomId}/join`, { role });
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

  /**
   * Rời khỏi phòng chơi
   * POST /api/rooms/:roomId/leave
   */
  leaveRoom: async (roomId) => {
    const response = await authClient.post(`/api/rooms/${roomId}/leave`);
    return response.data;
  },

  /**
   * Lấy lịch sử chat của phòng
   * GET /api/rooms/:roomId/chat
   */
  getRoomChat: async (roomId) => {
    const response = await authClient.get(`/api/rooms/${roomId}/chat`);
    return response.data;
  },

  /**
   * Đánh dấu người chơi sẵn sàng hoặc huỷ sẵn sàng
   * POST /api/games/:roomId/ready?isReady=true
   */
  ready: async (roomId, isReady) => {
    const response = await authClient.post(`/api/games/${roomId}/ready?isReady=${isReady}`);
    return response.data;
  },

  /**
   * Đầu hàng ván cờ
   * POST /api/games/:roomId/resign
   */
  resign: async (roomId) => {
    const response = await authClient.post(`/api/games/${roomId}/resign`);
    return response.data;
  },
};

