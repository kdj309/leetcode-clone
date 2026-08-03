import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import useTheme from '@mui/material/styles/useTheme';
import { useLeaderboardStore } from '../../../store';

export default function LeaderBoardTablePagination() {
  const theme = useTheme();
  const currentPage = useLeaderboardStore((state) => state.pagination.currentPage);
  const pageSize = useLeaderboardStore((state) => state.pagination.pageSize);
  const totalPages = useLeaderboardStore((state) => state.pagination.totalPages);
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
        minHeight: '64px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: 1,
      }}
    >
      <Stack direction='row' spacing={2} alignItems='center'>
        <FormControl size='small' sx={{ minWidth: 120 }}>
          <Select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as number)}
            label='Results per page'
            inputProps={{ 'aria-label': 'Results per page' }}
          >
            <MenuItem value={10}>10 per page</MenuItem>
            <MenuItem value={25}>25 per page</MenuItem>
            <MenuItem value={50}>50 per page</MenuItem>
            <MenuItem value={100}>100 per page</MenuItem>
          </Select>
        </FormControl>
        <Typography variant='body2' color='textSecondary'>
          {totalUsers === 0
            ? 'No users to show'
            : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, totalUsers)} of ${totalUsers} users`}
        </Typography>
      </Stack>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => setCurrentPage(page)}
        color='primary'
        showFirstButton
        showLastButton
      />
    </Box>
  );
}
