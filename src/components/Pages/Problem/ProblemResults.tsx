import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { usethemeUtils } from '../../../context/ThemeWrapper'; // Adjust path if needed

interface ProblemResultsProps {
  variables: string[];
  inputValues: string[];
  standardOutput: string | null;
  expectedOutput: string | null;
  status?: {
    id: number;
    description: string;
  };
  stderr?: string | null;
  compileOutput?: string | null;
}

export default function ProblemResults({
  variables,
  inputValues,
  standardOutput,
  expectedOutput,
  status,
  stderr,
  compileOutput,
}: ProblemResultsProps) {
  const { colorMode } = usethemeUtils();
  const isDarkMode = colorMode === 'dark';
  
  const boxBg = isDarkMode ? '#1e2227' : '#ECECEC';
  const errorBg = isDarkMode ? '#3b181a' : '#fde8e8';
  const hasError = status && status.description !== 'Accepted';
  const errorMessage = stderr || compileOutput;

  return (
    <Stack spacing={1.5} className='tw-p-2'>
      {/* 1. Submission Status Header */}
      {status && (
        <Box className='tw-flex tw-items-center tw-gap-2'>
          <Chip
            label={status.description}
            color={status.description === 'Accepted' ? 'success' : 'error'}
            size='small'
            variant='filled'
          />
        </Box>
      )}

      {/* 2. Error Trace Section (Displays Runtime / Compile Error details) */}
      {hasError && errorMessage && (
        <Stack spacing={0.5}>
          <Typography color='error' className='tw-font-medium'>
            Error Message
          </Typography>
          <Typography
            component='pre'
            sx={{
              backgroundColor: errorBg,
              color: isDarkMode ? '#f87171' : '#9f1239',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
            className='tw-p-3 tw-rounded-md tw-whitespace-pre-wrap tw-break-words'
          >
            {errorMessage}
          </Typography>
        </Stack>
      )}

      {/* 3. Inputs */}
      {variables.map((l, j) => (
        <Stack key={`input${j}`}>
          <Typography color='primary'>{l} =</Typography>
          <Typography
            variant='body1'
            className='tw-p-2 tw-rounded-md'
            sx={{ backgroundColor: boxBg }}
          >
            {inputValues[j]}
          </Typography>
        </Stack>
      ))}

      {/* 4. Output */}
      <Stack>
        <Typography color='primary'>Output</Typography>
        <Typography
          sx={{ backgroundColor: boxBg }}
          className='tw-p-2 tw-rounded-md'
        >
          {standardOutput ?? 'null'}
        </Typography>
      </Stack>

      {/* 5. Expected Output */}
      <Stack>
        <Typography color='primary'>Expected</Typography>
        <Typography
          sx={{ backgroundColor: boxBg }}
          className='tw-p-2 tw-rounded-md'
        >
          {expectedOutput}
        </Typography>
      </Stack>
    </Stack>
  );
}