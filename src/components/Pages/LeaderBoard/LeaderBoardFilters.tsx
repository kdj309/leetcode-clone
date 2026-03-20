import { Box, TextField, InputAdornment, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLeaderboardStore } from '../../../store/leaderboardSlice';
import { usethemeUtils } from '../../../context/ThemeWrapper';


export default function LeaderBoardFilters() {
  const theme = useTheme();
  const { colorMode } = usethemeUtils();
  const setSearchQuery = useLeaderboardStore((state) => state.setSearchQuery);
  const searchQuery = useLeaderboardStore((state) => state.filters.searchQuery);

  return (
    <Box sx={{ px: 2, py: 2 }}>
      <TextField
        placeholder="Search leaderboard..."
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: theme.palette.text.secondary }} />
            </InputAdornment>
          ),
        }}
        sx={{
          maxWidth: '400px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: colorMode === 'dark' ? theme.palette.background.paper : '#f9f9f9',
            '&:hover': {
              backgroundColor: theme.palette.background.paper,
            },
          },
        }}
      />
    </Box>
  );
}