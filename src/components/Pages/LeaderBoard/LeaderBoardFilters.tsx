import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import useTheme from '@mui/material/styles/useTheme';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useLeaderboardStore } from '../../../store';
import { usethemeUtils } from '../../../context/ThemeWrapper';

export default function LeaderBoardFilters() {
  const theme = useTheme();
  const { colorMode } = usethemeUtils();
  const setSearchQuery = useLeaderboardStore((state) => state.setSearchQuery);
  const searchQuery = useLeaderboardStore((state) => state.filters.searchQuery);
  const timePeriod = useLeaderboardStore((state) => state.filters.timePeriod);
  const setTimePeriod = useLeaderboardStore((state) => state.setTimePeriod);
  const showRankIndicators = useLeaderboardStore((state) => state.ui.showRankIndicators);
  const toggleShowRankIndicators = useLeaderboardStore((state) => state.toggleShowRankIndicators);

  return (
    <Box sx={{ px: 2, py: 2 }}>
      <Stack direction='row' spacing={2} alignItems='center'>
        <Box sx={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <TextField
            placeholder='Search leaderboard...'
            variant='outlined'
            size='small'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: '100%',
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
                  <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 24 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <FormControl size='small' sx={{ minWidth: 120 }}>
          <Select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value as 'today' | 'week' | 'month' | 'all')}
            sx={{
              borderRadius: '8px',
              backgroundColor: colorMode === 'dark' ? theme.palette.background.paper : '#f9f9f9',
              '&:hover': {
                backgroundColor: theme.palette.background.paper,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <MenuItem value='all'>All Time</MenuItem>
            <MenuItem value='today'>Today</MenuItem>
            <MenuItem value='week'>This Week</MenuItem>
            <MenuItem value='month'>This Month</MenuItem>
          </Select>
        </FormControl>

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
