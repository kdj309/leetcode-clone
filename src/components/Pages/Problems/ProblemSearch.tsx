import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

export default function ProblemSearch({
  queryvalue,
  onChangeHandler,
  clear,
}: {
  queryvalue: string;
  onChangeHandler: (queryvalue: string) => void;
  clear: () => void;
}) {
  return (
    <>
      <OutlinedInput
        id='outlined-adornment-password'
        className='tw-m-2'
        inputProps={{ className: 'tw-p-2' }}
        onChange={(e) => onChangeHandler(e.target.value)}
        value={queryvalue}
        size='small'
        placeholder='Search by title'
        endAdornment={
          <InputAdornment position='end'>
            <IconButton aria-label='toggle password visibility' onClick={clear} edge='end' size='small'>
              {queryvalue.trim() != '' && <ClearOutlinedIcon />}
            </IconButton>
          </InputAdornment>
        }
      />
    </>
  );
}
