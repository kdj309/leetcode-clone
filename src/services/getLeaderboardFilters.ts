import { protectedapi } from '../API/Index';
import { LeaderboardUser, LeaderboardPagination } from '../utils/types';

export interface LeaderboardFiltersParams {
  userName?: string;
  period?: 'all' | 'week' | 'month' | 'today';
  page?: number;
  limit?: number;
}

export interface LeaderboardFiltersResponse {
  users: LeaderboardUser[];
  pagination?: LeaderboardPagination;
}

/**
 * Fetch leaderboard data with filters applied
 * Supports search by username, filter by time period, and pagination
 * 
 * @param params - Filter params (userName, period, page, limit)
 * @returns Filtered leaderboard data with pagination
 * 
 * @example
 * const data = await getLeaderboardFilters({
 *   userName: 'john',
 *   period: 'week',
 *   page: 1,
 *   limit: 50
 * });
 */
export async function getLeaderboardFilters(
  params: LeaderboardFiltersParams
): Promise<LeaderboardFiltersResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params.userName && params.userName.trim()) {
      queryParams.append('userName', params.userName.trim());
    }
    if (params.period && params.period !== 'all') {
      queryParams.append('period', params.period);
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const response = await protectedapi.get<{
      status: 'Success' | 'Failure';
      data: {
        users: LeaderboardUser[];
        pagination?: LeaderboardPagination;
      };
      message?: string;
    }>(
      `/leaderboard/filters${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );

    if (response.data.status === 'Success' && response.data.data) {
      return {
        users: Array.isArray(response.data.data.users) ? response.data.data.users : [],
        pagination: response.data.data.pagination,
      };
    }

    throw new Error(response.data.message || 'Failed to fetch filtered leaderboard');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`[getLeaderboardFilters] ${error.message}`);
    }
    throw error;
  }
}
