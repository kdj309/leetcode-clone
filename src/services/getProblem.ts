import { protectedapi } from '../API/Index';
import { getProblemType } from '../utils/types';
const getProblem = async (id: string) => {
  try {
    const response = await protectedapi.get<getProblemType>(`/problems/${id}`);
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

export default getProblem;
