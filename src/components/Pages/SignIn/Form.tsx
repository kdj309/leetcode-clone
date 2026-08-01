import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import { useMutation } from '@tanstack/react-query';
import signIn from '../../../services/signIn';
import { useNavigate } from 'react-router';
import { useAuthSlice } from '../../../store/authslice/auth';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { toast } from 'sonner';
import { usethemeUtils } from '../../../context/ThemeWrapper';

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const signin = useAuthSlice((state) => state.signIn);
  const navigate = useNavigate();
  const { colorMode } = usethemeUtils();

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const { mutateAsync } = useMutation({
    mutationFn: signIn,
    mutationKey: ['signIn'],
  });
  const onClickHandler = async () => {
    try {
      const data = await mutateAsync({ email, password });
      if (data?.status === 'Success') {
        signin();
        navigate('/', { state: data.data.id });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: 'bottom-left',
        });
      }
    }
  };
  const signInAsGuest = async () => {
    try {
      const data = await mutateAsync({
        email: import.meta.env.VITE_GUEST_USER_EMAIL,
        password: import.meta.env.VITE_GUEST_USER_PASSWORD,
      });
      if (data?.status === 'Success') {
        signin();
        navigate('/', { state: data.data.id });
      } else {
        throw new Error('Guest Sign In Failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: 'bottom-left',
        });
      }
    }
  };
  const colorStyles = useMemo(() => ({ color: colorMode === 'dark' ? 'common.white' : 'common.black' }), [colorMode]);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
      <div className='tw-flex tw-flex-col tw-items-center tw-gap-0'>
        <Button color='warning' variant='contained' onClick={onClickHandler}>
          Sign In
        </Button>
        <div>Or</div>
        <Button color='warning' variant='contained' onClick={signInAsGuest}>
          Sign In as Guest
        </Button>
      </div>
    </Box>
  );
}
