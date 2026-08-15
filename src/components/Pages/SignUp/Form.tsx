import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import { useMemo, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useMutation } from '@tanstack/react-query';
import signUp from '../../../services/signUp';
import LanguageDropDown from '../Problem/LanguageDropDown';
import { toast } from 'sonner';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { useAuthSlice } from '../../../store/authslice/auth';
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate();
  const { colorMode } = usethemeUtils();
  const signin = useAuthSlice((state) => state.signIn);

  const { mutateAsync } = useMutation({
    mutationFn: signUp,
    mutationKey: ['user-create'],
  });

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  async function handleSubmit() {
    if (password !== confirmPassword) {
      toast.warning('Password Did Not Match', { position: 'bottom-left', duration: 2000, dismissible: true });
      return;
    }
    try {
      const response = await mutateAsync({
        username,
        email,
        password,
        favoriteProgrammingLanguage,
        roles: ['user'],
      });
      if (response?.status === 'Success') {
        toast.success('User Created Successfully', { position: 'bottom-left', duration: 2000, dismissible: true });
        signin();
        navigate('/', { state: response.data.id });
      } else {
        toast.error('User Creation Failed', { position: 'bottom-left', duration: 2000, dismissible: true });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { position: 'bottom-left' });
      }
    }
  }

  function handleChange(id: number) {
    setFavoriteProgrammingLanguage(id);
  }

  const colorStyles = useMemo(() => ({ color: colorMode === 'dark' ? 'common.white' : 'common.black' }), [colorMode]);

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
          slotProps={{
            inputLabel: {
              color: colorStyles.color,
            },
          }}
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
          slotProps={{
            inputLabel: {
              color: colorStyles.color,
            },
          }}
        />
      </FormControl>
      <FormControl variant='outlined' size='small'>
        <InputLabel focused={false} htmlFor='outlined-adornment-password'>
          Password
        </InputLabel>
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
        <InputLabel focused={false} htmlFor='outlined-adornment-password'>
          Confirm Password
        </InputLabel>
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
