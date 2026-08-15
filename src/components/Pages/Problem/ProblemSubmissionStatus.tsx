import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { lazy, Suspense } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
const Confetti = lazy(() => import('react-confetti'));
export default function ProblemSubmissionStatus({
  successCount,
  totalTestCases,
  problemSubmissionStatus,
  isFullmode = false,
}: {
  successCount: number;
  totalTestCases: number | undefined;
  problemSubmissionStatus: '' | 'Accepted' | 'Rejected';
  isFullmode: boolean;
}) {
  const { width, height } = useWindowSize();
  return (
    <Stack spacing={2} className='tw-h-[75dvh]' marginBlock={2} justifyContent='center'>
      <div className='tw-flex tw-justify-evenly tw-items-center'>
        {problemSubmissionStatus.trim() != '' && (
          <Typography
            fontWeight='bold'
            color={problemSubmissionStatus === 'Accepted' ? 'success' : 'error'}
            variant='subtitle2'
          >
            {problemSubmissionStatus}
          </Typography>
        )}
        <Typography>
          Passed Test Cases {successCount}/{totalTestCases}
        </Typography>
      </div>
      {problemSubmissionStatus === 'Accepted' && (
        <div style={{ justifySelf: 'center' }}>
          <Suspense fallback={<CircularProgress aria-label='Loading…' />}>
            <Confetti
              gravity={0.1}
              tweenDuration={3000}
              width={isFullmode ? width : 750}
              recycle={false}
              height={height - 1}
            />
          </Suspense>
          <Typography textAlign='center'>🎉You have successfully completed this problem!</Typography>
        </div>
      )}
    </Stack>
  );
}
