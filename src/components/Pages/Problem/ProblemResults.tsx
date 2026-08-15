import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function ProblemResults({
  variables,
  inputValues,
  standardOutput,
  expectedOutput,
}: {
  variables: string[];
  inputValues: string[];
  standardOutput: string | null;
  expectedOutput: string | null;
}) {
  return (
    <Stack>
      {variables.map((l, j) => (
        <Stack key={`input${j}`}>
          <Typography className='tw-p-2' color='primary'>
            {l} =
          </Typography>
          <Typography variant='body1' className='tw-p-2' sx={{ backgroundColor: '#ECECEC' }} bgcolor={'Background'}>
            {inputValues[j]}
          </Typography>
        </Stack>
      ))}
      <Typography className='tw-p-2' color='primary'>
        Output
      </Typography>
      <Typography sx={{ backgroundColor: '#ECECEC' }} className='tw-p-2'>
        {standardOutput}
      </Typography>
      <Typography className='tw-p-2' color='primary'>
        Expected
      </Typography>
      <Typography sx={{ backgroundColor: '#ECECEC' }} className='tw-p-2'>
        {expectedOutput}
      </Typography>
    </Stack>
  );
}
