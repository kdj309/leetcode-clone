import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

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
        <MenuItem value={'easy'}>Easy</MenuItem>
        <MenuItem value={'medium'}>Medium</MenuItem>
        <MenuItem value={'hard'}>Hard</MenuItem>
      </Select>
    </FormControl>
  );
}