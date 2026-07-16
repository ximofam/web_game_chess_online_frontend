import { authClient } from '../../auth/api/authClient';

/**
 * Service for managing user profile details and avatar image uploads.
 */
export const profileService = {
  /**
   * Fetch current user profile.
   * @returns {Promise<object>} User object with profile fields
   */
  getCurrentUser: async () => {
    const response = await authClient.get('/api/users/me');
    return response.data;
  },

  /**
   * Update profile details.
   * @param {{ fullName: string, gender: string, dateOfBirth: string }} data
   * @returns {Promise<object>} Updated user object
   */
  updateProfile: async (data) => {
    const response = await authClient.patch('/api/users/me', data);
    return response.data;
  },

  /**
   * Upload user profile avatar.
   * @param {File} file The image file object (jpg, png, webp)
   * @param {function(number): void} [onProgress] Optional callback to receive upload progress percent
   * @returns {Promise<{ avatarUrl: string }>} URL of updated avatar
   */
  uploadAvatar: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await authClient.patch('/api/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },
};

export default profileService;
