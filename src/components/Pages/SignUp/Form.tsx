import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useMutation } from '@tanstack/react-query';
import signUp from '../../../services/signUp';
import LanguageDropDown from '../Problem/LanguageDropDown';
import { toast } from 'sonner';
import { supportedLanguages } from '../../../constants/Index';

export default function SignUpForm() {
  const [email, setEmail] = useState<string>('');
  const [username, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showConfirmPassword, setShowconfirmPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickConfirmPassword = () => setShowconfirmPassword((show) => !show);
  const [favoriteProgrammingLanguage, setFavoriteProgrammingLanguage] = useState<number>(93);

  const { mutateAsync } = useMutation({
    mutationFn: signUp,
    mutationKey: ['user-create'],
  });

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  async function handleSubmit() {
    if (password != confirmPassword) {
      toast.warning('Password Did Not Match', { position: 'bottom-left' });
    }
    try {
      const response = await mutateAsync({
        username,
        email,
        password,
        favoriteProgrammingLanguage: supportedLanguages[favoriteProgrammingLanguage],
        roles: ['user'],
      });
      console.log({ response });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { position: 'bottom-left' });
      }
    }
  }

  function handleChange(id: number) {
    setFavoriteProgrammingLanguage(id);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <FormControl variant='outlined' size='small'>
        <TextField
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          id='standard-basic'
          type='text'
          label='Username'
          variant='outlined'
          size='small'
        />
      </FormControl>
      <FormControl variant='outlined' size='small'>
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id='standard-basic'
          type='email'
          label='E-mail'
          variant='outlined'
          size='small'
        />
      </FormControl>
      <FormControl variant='outlined' size='small'>
        <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
        <OutlinedInput
          id='outlined-adornment-password'
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          size='small'
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          }
          label='Password'
        />
      </FormControl>
      <FormControl variant='outlined' size='small'>
        <InputLabel htmlFor='outlined-adornment-password'>Confirm Password</InputLabel>
        <OutlinedInput
          id='outlined-adornment-password'
          type={showConfirmPassword ? 'text' : 'password'}
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          size='small'
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickConfirmPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
              >
                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          }
          label='confirm password'
        />
      </FormControl>
      <FormControl>
        <LanguageDropDown
          label='Favorite Language'
          handleChange={handleChange}
          language={favoriteProgrammingLanguage}
          languagestoskip={[]}
        />
      </FormControl>
      <Button color='warning' variant='contained' onClick={handleSubmit} type='submit'>
        Sign Up
      </Button>
    </Box>
  );
}
