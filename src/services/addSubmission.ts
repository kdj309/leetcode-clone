import { protectedapi } from '../API/Index';
import { submissionprops, updateUserType } from '../utils/types';
const addSubmission = async (updateUserProps: { id: string; newsubmission: submissionprops }) => {
  try {
    const response = await protectedapi.patch<updateUserType>(
      `/users/${updateUserProps.id}/submission`,
      updateUserProps.newsubmission
    );
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

export default addSubmission;
