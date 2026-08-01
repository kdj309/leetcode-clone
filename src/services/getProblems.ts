import api from '../API/Index';

/**
 * Get all problems with optional pagination
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 */
const getProblems = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await api.get<{
      status: string;
      data: {
        problems: any[];
        total: number;
      };
    }>(`/problems?page=${page}&limit=${limit}`);

    if (response.data.status === 'Failure') {
      throw new Error('Failed to fetch problems');
    }

    return {
      problems: response.data.data.problems || [],
      total: response.data.data.total || 0,
      status: response.data.status,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export default getProblems;
