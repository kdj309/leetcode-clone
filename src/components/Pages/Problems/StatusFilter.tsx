import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';

export default function StatusFilter({
  value,
  handleChange,
}: {
  value: string;
  handleChange: (event: SelectChangeEvent) => void;
}) {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
      <InputLabel id='status-select-small-label'>Status</InputLabel>
      <Select
        labelId='status-select-small-label'
        id='demo-select-small'
        value={value}
        label='Status'
        onChange={handleChange}
      >
        <MenuItem value='all'>All</MenuItem>
        <MenuItem value='todo'>Todo</MenuItem>
        <MenuItem value='solved'>Solved</MenuItem>
        <MenuItem value='attempted'>Attempted</MenuItem>
      </Select>
    </FormControl>
  );
}
