import axios from 'axios';
import { getAccessToken, refreshToken } from '../../auth/api/authClient';

import { formatApiUrl } from '../../../shared/utils/apiUtils';

const rawAiApiUrl = import.meta.env.VITE_AI_API_URL || '';
export const AI_API_BASE_URL = formatApiUrl(rawAiApiUrl);

export const aiClient = axios.create({
  baseURL: AI_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request Interceptor: Attach in-memory Access Token to header
aiClient.interceptors.request.use(
  (config) => {
    const memoryToken = getAccessToken();
    if (memoryToken) {
      config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401s, run token refresh using the existing authClient
aiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard: Only handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return aiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      window.dispatchEvent(new Event('api:403'));
    }

    if (error.response?.status === 404) {
      window.dispatchEvent(new Event('api:404'));
    }

    return Promise.reject(error);
  }
);
