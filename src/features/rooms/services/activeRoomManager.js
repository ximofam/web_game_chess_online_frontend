/**
 * Helper quản lý trạng thái Phòng đang chờ thu nhỏ (Minimized Active Room)
 * Sử dụng sessionStorage & CustomEvent để đồng bộ giữa các component & trang.
 */
const STORAGE_KEY = 'minimized_active_room';
const EVENT_NAME = 'active_room_changed';

export const activeRoomManager = {
  getRoom: () => {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setRoom: (roomData) => {
    try {
      if (roomData) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(roomData));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: roomData }));
    } catch {
      // ignore storage errors
    }
  },

  clearRoom: () => {
    activeRoomManager.setRoom(null);
  },

  subscribe: (callback) => {
    const handler = (e) => callback(e.detail);
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  },
};
