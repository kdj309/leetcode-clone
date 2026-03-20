import { protectedapi } from '../API/Index';
import { refreshTokenRes } from '../utils/types';

const refreshToken = async () => {
  try {
    const response = await protectedapi.post<refreshTokenRes>('/auth/refresh');
    if (response.data.status === 'Failure') {
      throw new Error(response.data.error);
    }
    return response.data;
  } catch (error) {
    // Log the error for debugging
    console.error('[refreshToken] Failed to refresh token:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Token refresh failed');
  }
};

export default refreshToken;
