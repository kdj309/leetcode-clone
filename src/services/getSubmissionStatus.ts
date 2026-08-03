import judgeapi from '../API/judge0';

interface Judge0SubmissionStatusResponse {
  stdin: string;
  expected_output: string;
  language_id: number;
  status: {
    id: number;
    description: string;
  };
  stdout: null | string;
  stderr: null | string;
  memory: null | number;
  time: null | number;
}

export default async function getStatus(submissionId: string): Promise<Judge0SubmissionStatusResponse> {
  try {
    const response = await judgeapi.get<Judge0SubmissionStatusResponse>(
      `/submissions/${submissionId}?fields=stdout,stderr,language_id,stdin,status,expected_output,memory,time`
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
}
