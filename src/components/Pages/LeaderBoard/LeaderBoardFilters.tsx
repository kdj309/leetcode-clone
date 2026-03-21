import { Box, TextField, InputAdornment, useTheme, IconButton, Tooltip, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useLeaderboardStore } from '../../../store/leaderboardSlice';
import { usethemeUtils } from '../../../context/ThemeWrapper';

export default function LeaderBoardFilters() {
  const theme = useTheme();
  const { colorMode } = usethemeUtils();
  const setSearchQuery = useLeaderboardStore((state) => state.setSearchQuery);
  const searchQuery = useLeaderboardStore((state) => state.filters.searchQuery);
  const showRankIndicators = useLeaderboardStore((state) => state.ui.showRankIndicators);
  const toggleShowRankIndicators = useLeaderboardStore((state) => state.toggleShowRankIndicators);

  return (
    <Box sx={{ px: 2, py: 2 }}>
      <Stack direction='row' spacing={2} alignItems='center'>
        <TextField
          placeholder='Search leaderboard...'
          variant='outlined'
          size='small'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
        />

        <Tooltip title={showRankIndicators ? 'Hide rank indicators' : 'Show rank indicators'}>
          <IconButton
            size='small'
            onClick={() => toggleShowRankIndicators()}
            sx={{
              color: showRankIndicators ? theme.palette.primary.main : theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: colorMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              },
            }}
          >
            {showRankIndicators ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}
