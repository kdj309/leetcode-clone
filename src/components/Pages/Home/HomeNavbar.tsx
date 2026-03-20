import { Link as ReactLink, useLocation } from 'react-router-dom';
import darklogo from '../../../assets/images/logo-dark.26900637.svg';
import lightlogo from '../../../assets/images/logo-light.5034df26.svg';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { Button, Link } from '@mui/material';
import { useAuthSlice } from '../../../store/authslice/auth';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import Profile from '../../UI/Profile';

export default function HomeNavbar() {
  const { colorMode, toggleColorMode } = usethemeUtils();
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);
  const location = useLocation();

  return (
    <nav className='tw-container-lg tw-mx-auto tw-flex tw-justify-around tw-p-2 tw-bottom-2 tw-border-b-[#ffffff24]'>
      <div className='tw-flex tw-items-center tw-gap-2'>
        <img
          src={colorMode === 'light' ? darklogo : lightlogo}
          width={100}
          height={80}
          className='tw-object-contain'
        ></img>
        {location.pathname === '/leaderboard' && (
          <Link
            className={`tw-py-2 tw-px-4 ${colorMode === 'dark' ? 'tw-text-white' : ''}`}
            underline='hover'
            component={ReactLink}
            to='/'
          >
            Problems
          </Link>
        )}
        {location.pathname !== '/' && location.pathname !== '/leaderboard' && (
          <>
            <Link
              className={`tw-py-2 tw-px-4 ${colorMode === 'dark' ? 'tw-text-white' : ''}`}
              underline='hover'
              component={ReactLink}
              to='/'
            >
              Problems
            </Link>
            <Link
              className={`tw-py-2 tw-px-4 ${colorMode === 'dark' ? 'tw-text-white' : ''}`}
              underline='hover'
              component={ReactLink}
              to='/leaderboard'
            >
              Leaderboard
            </Link>
          </>
        )}
        {location.pathname === '/' && (
          <Link
            className={`tw-py-2 tw-px-4 ${colorMode === 'dark' ? 'tw-text-white' : ''}`}
            underline='hover'
            component={ReactLink}
            to='/leaderboard'
          >
            Leaderboard
          </Link>
        )}
      </div>
      <ul className='tw-list-none tw-flex tw-justify-between tw-items-center'>
        <li className='tw-flex tw-justify-center tw-items-center'>
          {!isLogedIn ? (
            <div className='tw-flex tw-justify-between tw-items-center'>
              <Link
                className={`tw-py-2 tw-px-4 ${colorMode === 'dark' ? 'tw-text-white' : ''}`}
                underline='hover'
                component={ReactLink}
                to='/signin'
              >
                Sign in
              </Link>
              <span>or</span>
              <Link
                className={`tw-py-2 tw-px-4 ${colorMode === 'dark' ? 'tw-text-white' : ''}`}
                underline='hover'
                component={ReactLink}
                to='/signup'
              >
                Sign up
              </Link>
            </div>
          ) : (
            <Profile />
          )}
        </li>
        <li>
          <Button
            className={colorMode === 'dark' ? 'tw-border-white' : ''}
            variant='text'
            onClick={toggleColorMode}
            size='large'
          >
            {colorMode === 'dark' ? <LightModeOutlinedIcon sx={{ color: 'white' }} /> : <DarkModeIcon />}
          </Button>
        </li>
      </ul>
    </nav>
  );
}
