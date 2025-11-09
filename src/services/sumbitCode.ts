import judgeapi from '../API/judge0';
interface submitCodeArgs {
  code: string;
  language_id: number;
  input: string;
  expected_output: string;
}
async function submitCode(params: submitCodeArgs) {
  try {
    const response = await judgeapi.post('/submissions', {
      source_code: params.code,
      language_id: params.language_id,
      stdin: params.input.replace('\\n', '\n'),
      expected_output: params.expected_output,
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}
export default submitCode;
