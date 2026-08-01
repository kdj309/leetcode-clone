import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useUserSlice } from '../../store/user';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthSlice } from '../../store/authslice/auth';
import { useMutation } from '@tanstack/react-query';
import signOutAPI from '../../services/signOut';
import { useNavigate } from 'react-router';

export default function Profile() {
  const user = useUserSlice((state) => state.user);
  const setUser = useUserSlice((state) => state.setUser);
  const signOut = useAuthSlice((state) => state.signOut);
  const navigate = useNavigate();
  const { mutateAsync, isError, error } = useMutation({
    mutationKey: ['sign-out'],
    mutationFn: signOutAPI,
  });
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    await mutateAsync();
    if (isError) {
      console.log(error);
      return;
    }
    setUser(null);
    signOut();
    navigate('/signin');
  };
  return (
    <>
      <Tooltip title='Account settings'>
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>{user?.username[0]}</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <EmailIcon />{' '}
          <Typography marginLeft={1} variant='body2'>
            {user?.email}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon onClick={handleLogout}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText onClick={handleLogout}>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
