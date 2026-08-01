import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import useTheme from '@mui/material/styles/useTheme';
import { useUserSlice } from '../../../store/user';
import useLeaderboardStore from '../../../store/leaderboardSlice';
import { usethemeUtils } from '../../../context/ThemeWrapper';

export default function UserStats() {
  const theme = useTheme();
  const { colorMode } = usethemeUtils();
  const currentUser = useUserSlice((state) => state.user);
  const currentUserStats = useLeaderboardStore((state) => state.getCurrentUserStats());

  if (!currentUser || !currentUserStats) {
    return null;
  }

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography variant='h6' sx={{ mb: 2, fontWeight: 700, color: theme.palette.text.primary }}>
        Your Statistics
      </Typography>

      <Paper
        sx={{
          p: 2.5,
          background:
            colorMode === 'dark'
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: colorMode === 'dark' ? theme.palette.text.primary : 'white',
          borderRadius: '12px',
          boxShadow: colorMode === 'dark' ? '0 4px 20px rgba(255,255,255,0.05)' : '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Grid2 container spacing={3}>
          {/* Item 1 */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack direction='row' alignItems='center' spacing={1.5}>
              <Avatar sx={{ width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.2)' }}>🥇</Avatar>
              <Box>
                <Typography variant='body2' sx={{ opacity: colorMode === 'dark' ? 0.8 : 0.9 }}>
                  Your Rank
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>
                  #{currentUserStats.currentRank || 'N/A'}
                </Typography>
              </Box>
            </Stack>
          </Grid2>

          {/* Item 2 */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack direction='row' alignItems='center' spacing={1.5}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: colorMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                }}
              >
                ⭐
              </Avatar>
              <Box>
                <Typography variant='body2' sx={{ opacity: colorMode === 'dark' ? 0.8 : 0.9 }}>
                  Points
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>
                  {currentUserStats.totalPoints}
                </Typography>
              </Box>
            </Stack>
          </Grid2>

          {/* Item 3 */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack direction='row' alignItems='center' spacing={1.5}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: colorMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                }}
              >
                ✅
              </Avatar>
              <Box>
                <Typography variant='body2' sx={{ opacity: colorMode === 'dark' ? 0.8 : 0.9 }}>
                  Easy
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>
                  {currentUserStats.easyProblems}
                </Typography>
              </Box>
            </Stack>
          </Grid2>

          {/* Item 4 */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack direction='row' alignItems='center' spacing={1.5}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: colorMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                }}
              >
                🔥
              </Avatar>
              <Box>
                <Typography variant='body2' sx={{ opacity: colorMode === 'dark' ? 0.8 : 0.9 }}>
                  Total Solved
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>
                  {currentUserStats.totalSolved}
                </Typography>
              </Box>
            </Stack>
          </Grid2>
        </Grid2>
      </Paper>
    </Box>
  );
}
