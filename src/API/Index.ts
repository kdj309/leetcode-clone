import axios, { AxiosError } from 'axios';
import refreshToken from '../services/retryToken';
import signOutAPI from '../services/signOut';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const protectedapi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default api;

// Guards against signOutAPI's own request coming back with a 401 and
// re-entering this same interceptor (which would trigger another
// refresh/sign-out attempt on top of the one already in progress).
let isSigningOut = false;

protectedapi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    // @ts-ignore
    if (originalRequest && error.response && error.response.status === 401 && !originalRequest?._retry && !isSigningOut) {
      // @ts-ignore
      originalRequest._retry = true;
      try {
        await refreshToken();
        return protectedapi(originalRequest);
      } catch (refreshError) {
        isSigningOut = true;
        try {
          await signOutAPI();
        } catch {
          // Ignore logout failures and redirect to signin anyway.
        } finally {
          isSigningOut = false;
        }

        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);