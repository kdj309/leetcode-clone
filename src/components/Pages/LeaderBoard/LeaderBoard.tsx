import { useEffect } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import HomeNavbar from '../Home/HomeNavbar';
import UserStats from './UserStats';
import LeaderBoardFilters from './LeaderBoardFilters';
import LeaderBoardTable from './LeaderBoardTable';
import getLeaderBoardPagination from '../../../services/getLeaderBoardPagination';
import { useUserSlice } from '../../../store/user';
import useLeaderboardStore from '../../../store/leaderboardSlice';
import LeaderBoardTablePagination from './LeaderBoardTablePagination';

export default function LeaderBoard() {
  const theme = useTheme();
  const currentUser = useUserSlice((state) => state.user);
  const setLeaderboardUsers = useLeaderboardStore((state) => state.setLeaderboardUsers);
  const setLoading = useLeaderboardStore((state) => state.setLoading);
  const setError = useLeaderboardStore((state) => state.setError);
  const setCurrentUser = useLeaderboardStore((state) => state.setCurrentUser);
  const setPaginationState = useLeaderboardStore((state) => state.setPaginationState);
  const currentPage = useLeaderboardStore((state) => state.pagination.currentPage);
  const pageSize = useLeaderboardStore((state) => state.pagination.pageSize);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['leaderboard', currentPage, pageSize],
    queryFn: () => getLeaderBoardPagination(currentPage, pageSize),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data?.data) {
      setLeaderboardUsers(data.data.users, new Date());
      setPaginationState({
        totalPages: data.data.pagination.totalPages,
        totalUsers: data.data.pagination.totalUsers,
        hasNextPage: data.data.pagination.hasNextPage,
        hasPrevPage: data.data.pagination.hasPrevPage,
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

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <HomeNavbar />
      <Container maxWidth='xl' sx={{ py: 3 }}>
        <UserStats />
        <LeaderBoardFilters />
        <LeaderBoardTable />
        <LeaderBoardTablePagination />
      </Container>
    </Box>
  );
}
