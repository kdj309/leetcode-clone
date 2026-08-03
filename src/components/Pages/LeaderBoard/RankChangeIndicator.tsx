import Box from '@mui/material/Box';
import useTheme from '@mui/material/styles/useTheme';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface RankChangeIndicatorProps {
  previousRank: number | null | undefined;
  currentRank: number;
}

export default function RankChangeIndicator({ previousRank, currentRank }: RankChangeIndicatorProps) {
  const theme = useTheme();

  if (!previousRank || previousRank === currentRank) {
    return null;
  }

  const rankChange = previousRank - currentRank;
  const isImproved = rankChange > 0;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        marginLeft: '8px',
        animation: 'fadeIn 0.3s ease-in-out',
        '@keyframes fadeIn': {
          from: {
            opacity: 0,
            transform: 'scale(0.8)',
          },
          to: {
            opacity: 1,
            transform: 'scale(1)',
          },
        },
      }}
    >
      {isImproved ? (
        <ArrowUpwardIcon
          titleAccess={`Rank improved by ${rankChange}`}
          sx={{
            fontSize: '1.2rem',
            color: theme.palette.success.main,
            fontWeight: 600,
          }}
        />
      ) : (
        <ArrowDownwardIcon
          titleAccess={`Rank dropped by ${Math.abs(rankChange)}`}
          sx={{
            fontSize: '1.2rem',
            color: theme.palette.error.main,
            fontWeight: 600,
          }}
        />
      )}
    </Box>
  );
}
