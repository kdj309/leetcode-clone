import { protectedapi } from '../API/Index';
import { commonresponse } from '../utils/types';

export interface LeaderboardUser {
  _id: string;
  userId: {
    _id:string;
    username:string;
  };
  username: string;
  totalPoints: number;
  easyProblems: number;
  mediumProblems: number;
  hardProblems: number;
  totalSolved: number;
  currentRank: number;
  previousRank: number;
  isOnline: boolean;
  lastUpdated: Date;
}

export interface LeaderboardResponse extends Omit<commonresponse, 'data'> {
  data: {
    users: LeaderboardUser[];
    pagination: {
      page: number;
      limit: number;
      totalUsers: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

const getLeaderBoardPagination = async (
  page: number = 1,
  limit: number = 50
): Promise<LeaderboardResponse> => {
  try {
    const response = await protectedapi.get<LeaderboardResponse>(
      `/leaderboard/paginated`,
      {
        params: {
          page,
          limit,
        },
      }
    );

    if (response.data.status === 'Failure') {
      throw new Error(response.data.error || 'Failed to fetch leaderboard');
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch leaderboard');
  }
};

export default getLeaderBoardPagination;