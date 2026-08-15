import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import useTheme from '@mui/material/styles/useTheme';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import HomeNavbar from '../Home/HomeNavbar';
import UserStats from './UserStats';
import LeaderBoardFilters from './LeaderBoardFilters';
import LeaderBoardTable from './LeaderBoardTable';
import { useUserSlice } from '../../../store/user';
import useLeaderboardStore from '../../../store';
import LeaderBoardTablePagination from './LeaderBoardTablePagination';
import useDebounce from '../../../hooks/useDebounce';
import { getLeaderboardFilters } from '../../../services/getLeaderboardFilters';

const getSseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured');
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const safeBase = normalizedBase.startsWith('http') ? normalizedBase : `https://${normalizedBase}`;

  return new URL('leaderboard/events', `${safeBase}/`).toString();
};

export default function LeaderBoard() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const currentUser = useUserSlice((state) => state.user);
  const setLeaderboardUsers = useLeaderboardStore((state) => state.setLeaderboardUsers);
  const setLoading = useLeaderboardStore((state) => state.setLoading);
  const setError = useLeaderboardStore((state) => state.setError);
  const setCurrentUser = useLeaderboardStore((state) => state.setCurrentUser);
  const setPaginationState = useLeaderboardStore((state) => state.setPaginationState);
  const setRealtimeConnected = useLeaderboardStore((state) => state.setRealtimeConnected);
  const updateRealtimeData = useLeaderboardStore((state) => state.updateRealtimeData);
  const currentPage = useLeaderboardStore((state) => state.pagination.currentPage);
  const pageSize = useLeaderboardStore((state) => state.pagination.pageSize);
  const searchQuery = useLeaderboardStore((state) => state.filters.searchQuery);
  const timePeriod = useLeaderboardStore((state) => state.filters.timePeriod);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['leaderboard', currentPage, pageSize, debouncedSearch.trim(), timePeriod],
    queryFn: () =>
      getLeaderboardFilters({
        userName: debouncedSearch.trim() || undefined,
        period: timePeriod === 'all' ? undefined : timePeriod,
        page: currentPage,
        limit: pageSize,
      }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data?.users && Array.isArray(data.users)) {
      setError(null);
      setLeaderboardUsers(data.users || [], new Date());
      setPaginationState({
        totalPages: data.pagination?.totalPages ?? 1,
        totalUsers: data.pagination?.totalUsers ?? data.users.length,
        hasNextPage: data.pagination?.hasNextPage ?? false,
        hasPrevPage: data.pagination?.hasPrevPage ?? false,
      });
    }
  }, [data, setError, setLeaderboardUsers, setPaginationState]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (isError) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load leaderboard';
      setError(errorMessage);
    }
  }, [isError, error, setError]);

  useEffect(() => {
    if (currentUser?._id) {
      setCurrentUser(currentUser._id);
    }
  }, [currentUser, setCurrentUser]);

  useEffect(() => {
    let sseUrl = '';

    try {
      sseUrl = getSseUrl();
    } catch (error) {
      console.error('Failed to build leaderboard SSE URL', error);
      setRealtimeConnected(false);
      return;
    }

    const eventSource = new EventSource(sseUrl, { withCredentials: true });

    eventSource.onopen = () => {
      setRealtimeConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const update = {
          userId: payload?.data?.triggeredBy || 'server',
          type: 'rank_change' as const,
          data: payload?.data || {},
          timestamp: new Date(payload?.timestamp || Date.now()),
        };

        updateRealtimeData([update]);

        if (payload?.data?.data && Array.isArray(payload.data.data)) {
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        }
      } catch (error) {
        console.error('Failed to parse leaderboard SSE payload', error);
      }
    };

    eventSource.onerror = () => {
      setRealtimeConnected(false);
    };

    return () => {
      eventSource.close();
      setRealtimeConnected(false);
    };
  }, [setLeaderboardUsers, setPaginationState, setRealtimeConnected, updateRealtimeData]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <HomeNavbar />
      <Container maxWidth='xl' sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 0 }}>
        <UserStats />
        <LeaderBoardFilters />
        <LeaderBoardTable />
        <LeaderBoardTablePagination />
      </Container>
    </Box>
  );
}
