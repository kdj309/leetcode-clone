import React, { useState } from 'react';
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
import { useMutation } from '@tanstack/react-query';
import signIn from '../../../services/signIn';
import { useNavigate } from 'react-router';
import { useAuthSlice } from '../../../store/authslice/auth';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { toast } from 'sonner';

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const signin = useAuthSlice((state) => state.signIn);
  const navigate = useNavigate();
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
      <Button color='warning' variant='contained' onClick={onClickHandler}>
        Sign In
      </Button>
    </Box>
  );
}
