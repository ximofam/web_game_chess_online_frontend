const GUEST_TOKEN_KEY = 'guestToken';

export const setGuestToken = (token) => {
  if (!token) return;
  try {
    localStorage.setItem(GUEST_TOKEN_KEY, token);
  } catch (error) {
    console.error('Lỗi khi lưu guest token vào localStorage:', error);
  }
};

export const getGuestToken = () => {
  try {
    return localStorage.getItem(GUEST_TOKEN_KEY);
  } catch (error) {
    console.error('Lỗi khi lấy guest token từ localStorage:', error);
    return null;
  }
};

export const removeGuestToken = () => {
  try {
    localStorage.removeItem(GUEST_TOKEN_KEY);
  } catch (error) {
    console.error('Lỗi khi xóa guest token từ localStorage:', error);
  }
};
