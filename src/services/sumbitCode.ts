import  { protectedapi } from '../API/Index';
interface submitCodeArgs {
  code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
  userId:string
}
async function submitCode(params: submitCodeArgs) {
  try {
    const response = await protectedapi.post(
      `users/${params.userId}/submissions`,
      {
        source_code: params.code,
        language_id: params.language_id,
        stdin: params?.stdin?.replace('\\n', '\n'),
        expected_output: params.expected_output,
        userId:params.userId
      },
    );
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}
export default submitCode;
