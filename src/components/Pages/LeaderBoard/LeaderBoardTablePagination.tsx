import { Box, Button, Stack, Select, MenuItem, FormControl, Typography, Pagination, useTheme } from '@mui/material';
import { useLeaderboardStore } from '../../../store/leaderboardSlice/leaderboard';

export default function LeaderBoardTablePagination() {
  const theme = useTheme();
  const currentPage = useLeaderboardStore((state) => state.pagination.currentPage);
  const pageSize = useLeaderboardStore((state) => state.pagination.pageSize);
  const totalPages = useLeaderboardStore((state) => state.pagination.totalPages);
  const hasNextPage = useLeaderboardStore((state) => state.pagination.hasNextPage);
  const hasPrevPage = useLeaderboardStore((state) => state.pagination.hasPrevPage);
  const totalUsers = useLeaderboardStore((state) => state.pagination.totalUsers);

  const setCurrentPage = useLeaderboardStore((state) => state.setCurrentPage);
  const setPageSize = useLeaderboardStore((state) => state.setPageSize);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 4,
        p: 2,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: 1,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as number)}
            label="Results per page"
          >
            <MenuItem value={10}>10 per page</MenuItem>
            <MenuItem value={25}>25 per page</MenuItem>
            <MenuItem value={50}>50 per page</MenuItem>
            <MenuItem value={100}>100 per page</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" color="textSecondary">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
        </Typography>
      </Stack>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => setCurrentPage(page)}
        color="primary"
        showFirstButton
        showLastButton
      />

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={!hasPrevPage}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={!hasNextPage}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
}
