import api from '../API/Index';
import { getUserType } from '../utils/types';
const getUser = async (id: string) => {
  try {
    const response = await api.get<getUserType>(`/users/${id}`, { withCredentials: true });
    if (response.data.status === 'Failure') {
      throw new Error(response.data.error);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export default getUser;
