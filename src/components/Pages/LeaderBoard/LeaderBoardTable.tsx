import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  useTheme,
} from '@mui/material';
import { useUserSlice } from '../../../store/user';
import { LeaderboardUser } from '../../../utils/types';
import useLeaderboardStore from '../../../store/leaderboardSlice';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import RankChangeIndicator from './RankChangeIndicator';

const HeaderCell = ({ children, align, theme, colorMode }: any) => (
  <TableCell
    align={align}
    sx={{
      fontWeight: 700,
      fontSize: '0.95rem',
      color: colorMode === 'dark' ? theme.palette.common.light : theme.palette.primary.main,
      padding: '16px 12px',
    }}
  >
    {children}
  </TableCell>
);

const DataCell = ({ children, align = 'left', sx = {} }: any) => (
  <TableCell align={align} sx={{ padding: '12px', ...sx }}>
    {children}
  </TableCell>
);

const RankCell = ({
  rank,
  showIndicators,
  previousRank,
}: {
  rank: number;
  showIndicators?: boolean;
  previousRank?: number;
}) => (
  <DataCell align='center' sx={{ textAlign: 'center', fontWeight: 600 }}>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {rank === 1 && <span style={{ fontSize: '1.3em' }}>🥇</span>}
      {rank === 2 && <span style={{ fontSize: '1.3em' }}>🥈</span>}
      {rank === 3 && <span style={{ fontSize: '1.3em' }}>🥉</span>}
      {rank > 3 && <span>{rank}</span>}
      {showIndicators && previousRank && <RankChangeIndicator previousRank={previousRank} currentRank={rank} />}
    </Box>
  </DataCell>
);

const DifficultyCell = ({ value, difficulty }: { value: number; difficulty: string }) => {
  const difficultyColors: Record<string, any> = {
    easy: 'success',
    medium: 'warning',
    hard: 'error',
  };
  return (
    <DataCell align='center'>
      <Chip
        label={value}
        color={difficultyColors[difficulty] || 'warning'}
        variant='outlined'
        size='small'
        sx={{ minWidth: 60 }}
      />
    </DataCell>
  );
};

const useTableColors = () => {
  const theme = useTheme();
  const { colorMode } = usethemeUtils();

  return {
    theme,
    colorMode,
    primaryColor: colorMode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
    headBg: colorMode === 'dark' ? theme.palette.background.paper : '#f5f5f5',
    containerShadow: colorMode === 'dark' ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.07)',
    rowAltBg: colorMode === 'dark' ? theme.palette.background.paper : '#fbfbfb',
    rowDefault: colorMode === 'dark' ? theme.palette.background.default : '#ffffff',
    rowHoverAlt: colorMode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f0f0f0',
    currentUserBg: colorMode === 'dark' ? 'rgba(66, 165, 245, 0.15)' : 'rgba(25, 118, 210, 0.08)',
    currentUserHover: colorMode === 'dark' ? 'rgba(66, 165, 245, 0.25)' : 'rgba(25, 118, 210, 0.12)',
  };
};

export default function LeaderBoardTable() {
  const colors = useTableColors();
  const visibleUsers = useLeaderboardStore((state) => state.visibleUsers());
  const isLoading = useLeaderboardStore((state) => state.leaderboardData.isLoading);
  const error = useLeaderboardStore((state) => state.leaderboardData.error);
  const currentPage = useLeaderboardStore((state) => state.pagination.currentPage);
  const pageSize = useLeaderboardStore((state) => state.pagination.pageSize);
  const showRankIndicators = useLeaderboardStore((state) => state.ui.showRankIndicators);
  const user = useUserSlice((state) => state.user);

  const getInitials = (username: string): string => {
    return username
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity='error' sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!visibleUsers || visibleUsers.length === 0) {
    return (
      <Alert severity='info' sx={{ my: 2 }}>
        No leaderboard data available
      </Alert>
    );
  }

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <TableContainer component={Paper} sx={{ boxShadow: colors.containerShadow }}>
        <Table sx={{ minWidth: 800 }} aria-label='leaderboard table'>
          {/* Table Header */}
          <TableHead sx={{ backgroundColor: colors.headBg }}>
            <TableRow>
              <HeaderCell theme={colors.theme} colorMode={colors.colorMode} align='center'>
                Rank
              </HeaderCell>
              <HeaderCell theme={colors.theme} colorMode={colors.colorMode}>
                User
              </HeaderCell>
              <HeaderCell theme={colors.theme} colorMode={colors.colorMode} align='right'>
                Points
              </HeaderCell>
              <HeaderCell theme={colors.theme} colorMode={colors.colorMode} align='center'>
                Easy
              </HeaderCell>
              <HeaderCell theme={colors.theme} colorMode={colors.colorMode} align='center'>
                Medium
              </HeaderCell>
              <HeaderCell theme={colors.theme} colorMode={colors.colorMode} align='center'>
                Hard
              </HeaderCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {visibleUsers.map((row: LeaderboardUser, index: number) => {
              const isCurrentUser = user?._id === row.userId;
              const globalRank = (currentPage - 1) * pageSize + index + 1;

              return (
                <TableRow
                  key={row._id}
                  sx={{
                    backgroundColor: isCurrentUser
                      ? colors.currentUserBg
                      : index % 2 === 0
                        ? colors.rowAltBg
                        : colors.rowDefault,
                    '&:hover': {
                      backgroundColor: isCurrentUser ? colors.currentUserHover : colors.rowHoverAlt,
                    },
                    transition: 'background-color 0.2s',
                    borderLeft: isCurrentUser ? `4px solid ${colors.primaryColor}` : 'none',
                  }}
                >
                  <RankCell rank={globalRank} showIndicators={showRankIndicators} previousRank={row.previousRank} />

                  <DataCell>
                    <Stack direction='row' alignItems='center' spacing={1}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: isCurrentUser
                            ? colors.theme.palette.primary.main
                            : colors.theme.palette.action.disabled,
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}
                      >
                        {getInitials(row.userName)}
                      </Avatar>
                      <Box>
                        <Box
                          sx={{
                            fontWeight: 600,
                            color: colors.theme.palette.text.primary,
                            fontSize: '0.95rem',
                          }}
                        >
                          {row.userName}
                          {isCurrentUser && (
                            <Chip
                              label='You'
                              size='small'
                              color='primary'
                              variant='outlined'
                              sx={{ ml: 1, height: 24 }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Stack>
                  </DataCell>

                  <DataCell
                    align='right'
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: colors.primaryColor,
                    }}
                  >
                    {row.totalPoints}
                  </DataCell>

                  <DifficultyCell value={row.easyProblems} difficulty='easy' />
                  <DifficultyCell value={row.mediumProblems} difficulty='medium' />
                  <DifficultyCell value={row.hardProblems} difficulty='hard' />
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
