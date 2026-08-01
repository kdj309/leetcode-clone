import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import useTheme from '@mui/material/styles/useTheme';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useLeaderboardStore } from '../../../store/leaderboardSlice';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import useDebounce from '../../../hooks/useDebounce';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboardFilters } from '../../../services/getLeaderboardFilters';

export default function LeaderBoardFilters() {
  const theme = useTheme();
  const { colorMode } = usethemeUtils();
  const setSearchQuery = useLeaderboardStore((state) => state.setSearchQuery);
  const searchQuery = useLeaderboardStore((state) => state.filters.searchQuery);
  const timePeriod = useLeaderboardStore((state) => state.filters.timePeriod);
  const setTimePeriod = useLeaderboardStore((state) => state.setTimePeriod);
  const showRankIndicators = useLeaderboardStore((state) => state.ui.showRankIndicators);
  const toggleShowRankIndicators = useLeaderboardStore((state) => state.toggleShowRankIndicators);
  const setLeaderboardUsers = useLeaderboardStore((state) => state.setLeaderboardUsers);
  const setPaginationState = useLeaderboardStore((state) => state.setPaginationState);
  const setLoading = useLeaderboardStore((state) => state.setLoading);
  const setError = useLeaderboardStore((state) => state.setError);

  // Debounce search input with 500ms delay
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Use React Query for filters with caching
  const { isLoading, error, refetch } = useQuery({
    queryKey: ['leaderboard-filters', debouncedSearch.trim(), timePeriod],
    queryFn: async () => {
      const response = await getLeaderboardFilters({
        userName: debouncedSearch.trim() || undefined,
        period: timePeriod === 'all' ? undefined : timePeriod,
        page: 1,
        limit: 50,
      });

      // Validate response structure
      if (!response || !Array.isArray(response.users)) {
        throw new Error('Invalid response structure from API');
      }

      // Update store with API results
      setLeaderboardUsers(response.users, new Date());

      // Update pagination if available
      if (response.pagination) {
        setPaginationState({
          totalPages: response.pagination.totalPages ?? 1,
          totalUsers: response.pagination.totalUsers ?? 0,
          hasNextPage: response.pagination.hasNextPage ?? false,
          hasPrevPage: response.pagination.hasPrevPage ?? false,
        });
      }

      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    enabled: true, // Always enabled so API fires for all time option too
    refetchOnWindowFocus: false,
  });

  // Force refetch when switching to 'all' period
  useEffect(() => {
    if (timePeriod === 'all') {
      refetch();
    }
  }, [timePeriod, refetch]);

  // Sync store loading and error states with React Query
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch filtered leaderboard';
      setError(errorMessage);
    } else {
      setError(null);
    }
  }, [error, setError]);

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
            disabled={isLoading}
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
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                  ) : (
                    <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 24 }} />
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <FormControl size='small' sx={{ minWidth: 120 }}>
          <Select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value as 'today' | 'week' | 'month' | 'all')}
            disabled={isLoading}
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
