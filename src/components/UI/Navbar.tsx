import { Link as ReactLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import darklogo from '../../assets/images/logo_dark.png';
import lightlogo from '../../assets/images/logo_light.png';
import leetcodedarklogo from '../../assets/images/logo-dark.26900637.svg';
import leetcodelightlogo from '../../assets/images/logo-light.5034df26.svg';
import { usethemeUtils } from '../../context/ThemeWrapper';
import { Button, ButtonGroup, CircularProgress, Link, Stack, Typography } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import { useAuthSlice } from '../../store/authslice/auth';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import ShuffleOutlinedIcon from '@mui/icons-material/ShuffleOutlined';
import Profile from './Profile';
import { ChevronRightOutlined, ChevronLeftOutlined } from '@mui/icons-material';
import { useProblemSlice } from '../../store/problemSlice/problem';
import { getRandomIndex } from '../../utils/helpers';
import { useCallback, useReducer } from 'react';
import CustomDrawer from './Drawer';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

export default function Navbar({
  problemExecuteHandler,
  problemSubmitHandler,
  executionLoading = false,
  submitionLoading = false,
}: {
  problemExecuteHandler: () => void;
  problemSubmitHandler: () => void;
  executionLoading?: boolean;
  submitionLoading?: boolean;
}) {
  const { colorMode, toggleColorMode } = usethemeUtils();
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);
  const { problems } = useProblemSlice();
  const { problemname } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [openDrawer, toggleDrawerVisiblility] = useReducer((state) => !state, false);

  const problemNextPageHandler = useCallback(() => {
    const currentProblemIndex = problems.findIndex(
      (p) => p._id === (problemname?.slice(0, problemname.length - 1) as string)
    );
    if (currentProblemIndex === problems.length - 1) {
      navigate(`/problems/${problems[0]._id}1`);
    } else {
      const previousProblem = problems[currentProblemIndex + 1];
      navigate(`/problems/${previousProblem._id}${currentProblemIndex + 2}`);
    }
  }, [problems]);
  const toggleDrawer = () => {
    toggleDrawerVisiblility();
  };

  const problemPreviousPage = useCallback(() => {
    const currentProblemIndex = problems.findIndex(
      (p) => p._id === (problemname?.slice(0, problemname.length - 1) as string)
    );
    if (currentProblemIndex === 0) {
      navigate(`/problems/${problems[problems.length - 1]._id}${problems.length}`);
    } else {
      const previousProblem = problems[currentProblemIndex - 1];
      navigate(`/problems/${previousProblem._id}${currentProblemIndex}`);
    }
  }, [problems]);

  const randomProblemHandler = useCallback(() => {
    const randomIndex = getRandomIndex(problems.length);
    navigate(`/problems/${problems[randomIndex]._id}${randomIndex + 1}`);
  }, [problems]);

  return (
    <>
      {problems.length > 0 && <CustomDrawer problems={problems} open={openDrawer} toggleDrawer={toggleDrawer} />}
      <nav className='tw-border-b-[#ffffff24]'>
        <ul
          className={`tw-container-md tw-flex ${location.pathname.includes('/problems/') ? 'tw-justify-between' : 'tw-justify-evenly'} tw-mx-2 tw-items-center tw-list-none`}
        >
          <li className='tw-p-1 tw-flex tw-items-center tw-gap-6 '>
            <Link to='/' component={ReactLink} underline='hover'>
              {location.pathname.includes('/problems/') ? (
                <img
                  className='tw-object-contain'
                  src={colorMode === 'light' ? lightlogo : darklogo}
                  width={20}
                  height={20}
                ></img>
              ) : (
                <img
                  className='tw-object-contain'
                  src={colorMode === 'light' ? leetcodedarklogo : leetcodelightlogo}
                  width={100}
                  height={80}
                ></img>
              )}
            </Link>
            {isLogedIn && location.pathname.includes('/problems/') && (
              <div className='tw-flex tw-items-center tw-gap-3'>
                <ButtonGroup
                  disabled={problems.length === 0}
                  size='medium'
                  variant='text'
                  aria-label='Basic button group'
                >
                  <Button
                    sx={{ color: colorMode === 'dark' ? 'common.white' : 'common.black' }}
                    onClick={() => toggleDrawerVisiblility()}
                  >
                    <Stack gap='2' alignItems='center' flexDirection='row'>
                      <span>
                        <DoubleArrowOutlinedIcon
                          sx={{ color: colorMode === 'dark' ? 'common.white' : 'common.black' }}
                        />
                      </span>
                      <Typography variant='body2'>Problem List</Typography>
                    </Stack>
                  </Button>
                  <Button
                    sx={{ color: colorMode === 'dark' ? 'common.white' : 'common.black' }}
                    size='small'
                    onClick={problemPreviousPage}
                  >
                    <ChevronLeftOutlined
                      sx={{ color: colorMode === 'dark' ? 'common.white' : 'common.black' }}
                    ></ChevronLeftOutlined>
                  </Button>
                  <Button
                    sx={{ color: colorMode === 'dark' ? 'common.white' : 'common.black' }}
                    size='small'
                    onClick={problemNextPageHandler}
                  >
                    <ChevronRightOutlined
                      sx={{ color: colorMode === 'dark' ? 'common.white' : 'common.black' }}
                    ></ChevronRightOutlined>
                  </Button>
                  <Button
                    sx={{ color: colorMode === 'dark' ? 'common.white' : 'common.black' }}
                    size='small'
                    onClick={randomProblemHandler}
                  >
                    <ShuffleOutlinedIcon sx={{ color: colorMode === 'dark' ? 'common.white' : 'common.black' }} />
                  </Button>
                </ButtonGroup>
              </div>
            )}
          </li>
          {isLogedIn && location.pathname.includes('/problems/') && (
            <li>
              <div className='tw-flex tw-gap-2'>
                <ButtonGroup
                  disabled={problems.length === 0}
                  size='medium'
                  variant='text'
                  aria-label='Basic button group'
                >
                  {executionLoading || submitionLoading ? (
                    <Button variant='outlined' sx={{ color: colorMode === 'dark' ? 'common.white' : 'common.black' }}>
                      <Stack direction={'row'} alignItems='center' spacing={2}>
                        <Typography variant='body2'> Pending</Typography>
                        <CircularProgress size='25px' color='inherit' />
                      </Stack>
                    </Button>
                  ) : (
                    <>
                      <Button
                        sx={{ color: colorMode === 'dark' ? 'common.white' : 'common.black' }}
                        color='primary'
                        onClick={problemExecuteHandler}
                      >
                        <Stack direction={'row'} alignItems='center' spacing={2}>
                          <PlayArrowIcon fontSize='small' />
                          <Typography variant='body2'>Run</Typography>
                        </Stack>
                      </Button>
                      <Button
                        sx={{ color: colorMode === 'dark' ? 'common.white' : 'common.black' }}
                        onClick={problemSubmitHandler}
                      >
                        <Stack direction={'row'} alignItems='center' spacing={2}>
                          <CloudUploadOutlinedIcon color='success' fontSize='small' />
                          <Typography variant='body2'>Submit</Typography>
                        </Stack>
                      </Button>
                    </>
                  )}
                </ButtonGroup>
              </div>
            </li>
          )}
          <ul className='tw-list-none tw-flex tw-items-center'>
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
            <li className='tw-p-1'>
              <Button
                className={colorMode === 'dark' ? 'tw-border-white' : ''}
                variant='text'
                onClick={toggleColorMode}
              >
                {colorMode === 'dark' ? <LightModeIcon sx={{ color: 'white' }} /> : <DarkModeIcon />}
              </Button>
            </li>
          </ul>
        </ul>
      </nav>
    </>
  );
}
