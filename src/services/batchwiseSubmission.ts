import judgeapi from '../API/judge0';
import { batchsubmission } from '../utils/types';
async function batchwiseSubmission<T>(problems: T) {
  try {
    const response = await judgeapi.post<batchsubmission[]>(`/submissions/batch`, {
      submissions: problems,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export default batchwiseSubmission;
