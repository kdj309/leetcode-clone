import CircularProgress from '@mui/material/CircularProgress';

export default function Loader() {
  return (
    <CircularProgress
      size={60}
      sx={{
        color: 'primary.main',
      }}
    />
  );
}
