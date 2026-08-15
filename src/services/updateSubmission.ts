import { protectedapi } from '../API/Index';
import { IupdateSubmission, updateUserType } from '../utils/types';
const updateSubmission = async (updateUserProps: {
  submissionId: string;
  userId: string;
  updateduser: IupdateSubmission;
}) => {
  try {
    const response = await protectedapi.put<updateUserType>(
      `/users/${updateUserProps.userId}/submissions/${updateUserProps.submissionId}`,
      updateUserProps.updateduser
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

export default updateSubmission;
