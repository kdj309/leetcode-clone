import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';

export default function DifficultyFilter({
  value,
  handleChange,
}: {
  value: string;
  handleChange: (event: SelectChangeEvent) => void;
}) {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
      <InputLabel id='demo-select-small-label'>Difficulty</InputLabel>
      <Select
        labelId='demo-select-small-label'
        id='demo-select-small'
        value={value}
        label='Difficulty'
        onChange={handleChange}
      >
        <MenuItem value='all'>All</MenuItem>
        <MenuItem color='green' value={'easy'}>
          Easy
        </MenuItem>
        <MenuItem color='rgb(255, 184, 0)' value={'medium'}>
          Medium
        </MenuItem>
        <MenuItem color='red' value={'hard'}>
          Hard
        </MenuItem>
      </Select>
    </FormControl>
  );
}
