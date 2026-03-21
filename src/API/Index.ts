import axios, { AxiosError } from 'axios';
import refreshToken from '../services/retryToken';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const protectedapi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default api;

protectedapi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    // @ts-ignore
    if (originalRequest && error.response && error.response.status === 401 && !originalRequest?._retry) {
      // @ts-ignore
      originalRequest._retry = true;
      try {
        await refreshToken();
        return protectedapi(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear cookies and redirect to signin
        document.cookie = 'access-token=; max-age=0; path=/;';
        document.cookie = 'refresh-token=; max-age=0; path=/;';
        document.cookie = 'session-token=; max-age=0; path=/;';
        document.cookie = 'id=; max-age=0; path=/;';

        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
