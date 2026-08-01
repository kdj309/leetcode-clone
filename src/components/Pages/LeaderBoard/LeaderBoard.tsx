import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import useTheme from '@mui/material/styles/useTheme';
import { useQuery } from '@tanstack/react-query';
import HomeNavbar from '../Home/HomeNavbar';
import UserStats from './UserStats';
import LeaderBoardFilters from './LeaderBoardFilters';
import LeaderBoardTable from './LeaderBoardTable';
import getLeaderBoardPagination from '../../../services/getLeaderBoardPagination';
import { useUserSlice } from '../../../store/user';
import useLeaderboardStore from '../../../store/leaderboardSlice';
import LeaderBoardTablePagination from './LeaderBoardTablePagination';

const getSseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return new URL('/leaderboard/events', baseUrl).toString();
};

export default function LeaderBoard() {
  const theme = useTheme();
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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['leaderboard', currentPage, pageSize],
    queryFn: () => getLeaderBoardPagination(currentPage, pageSize),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data?.data && Array.isArray(data.data.users) && data.data.pagination) {
      setLeaderboardUsers(data.data.users || [], new Date());
      setPaginationState({
        totalPages: data.data.pagination.totalPages ?? 1,
        totalUsers: data.data.pagination.totalUsers ?? 0,
        hasNextPage: data.data.pagination.hasNextPage ?? false,
        hasPrevPage: data.data.pagination.hasPrevPage ?? false,
      });
    }
  }, [data, setLeaderboardUsers, setPaginationState]);

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
    const sseUrl = getSseUrl();
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
          setLeaderboardUsers(payload.data.data, new Date());
          setPaginationState({
            totalPages: Math.max(1, Math.ceil(payload.data.data.length / pageSize)),
            totalUsers: payload.data.data.length,
            hasNextPage: false,
            hasPrevPage: false,
          });
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
  }, [pageSize, setLeaderboardUsers, setPaginationState, setRealtimeConnected, updateRealtimeData]);

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
