import  { protectedapi } from '../API/Index';
import { batchSubmissionResponse } from '../utils/types';
async function batchwiseSubmission<T>(userId:string,problems: T) {
  try {
    const response = await protectedapi.post<batchSubmissionResponse>(
      `users/${userId}/submissions/batch`,
      {
        submissions: problems,
      },
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export default batchwiseSubmission;
