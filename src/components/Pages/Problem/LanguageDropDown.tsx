import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { supportedLanguages } from '../../../constants/Index';
import FormControl from '@mui/material/FormControl';
import { InputLabel } from '@mui/material';

export default function LanguageDropDown({
  language,
  handleChange,
  label,
  languagestoskip,
}: {
  handleChange: (id: number) => void;
  language: number;
  label: string;
  languagestoskip: number[];
}) {
  return (
    <FormControl size='small'>
      <InputLabel id='language-label'>{label}</InputLabel>
      <Select
        id='language'
        value={language}
        label={label}
        onChange={(event) => handleChange(parseInt(event.target.value as string))}
        size='small'
      >
        {Object.keys(supportedLanguages)
          .filter((v) => !languagestoskip?.includes(parseInt(v)))
          .map((l, id) => {
            return (
              <MenuItem key={`${id}${l}`} value={l}>
                {
                  // @ts-ignore
                  supportedLanguages[l]
                }
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
}
