import { protectedapi } from '../API/Index';
import { updateuser, updateUserType } from '../utils/types';
const updateSubmission = async (updateUserProps: { id: string; updateduser: updateuser }) => {
  try {
    const response = await protectedapi.patch<updateUserType>(
      `/users/${updateUserProps.id}`,
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
