import { Link as ReactLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import darklogo from '../../assets/images/logo_dark.png';
import lightlogo from '../../assets/images/logo_light.png';
import leetcodedarklogo from '../../assets/images/logo-dark.26900637.svg';
import leetcodelightlogo from '../../assets/images/logo-light.5034df26.svg';
import { usethemeUtils } from '../../context/ThemeWrapper';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import { useAuthSlice } from '../../store/authslice/auth';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import ShuffleOutlinedIcon from '@mui/icons-material/ShuffleOutlined';
import Profile from './Profile';
import { ChevronRightOutlined, ChevronLeftOutlined } from '@mui/icons-material';
import { useProblemSlice } from '../../store/problemSlice/problem';
import { getProblemWindow, getRandomIndex } from '../../utils/helpers';
import { useCallback, useMemo, useReducer } from 'react';
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
    const currentProblemIndex = problems.findIndex((p) => p._id === (problemname?.slice(0, 24) as string));
    if (currentProblemIndex === problems.length - 1) {
      navigate(`/problems/${problems[0]._id}1`);
    } else {
      const previousProblem = problems[currentProblemIndex + 1];
      navigate(`/problems/${previousProblem._id}${currentProblemIndex + 2}`);
    }
  }, [problems.length]);
  const toggleDrawer = () => {
    toggleDrawerVisiblility();
  };

  const problemPreviousPage = useCallback(() => {
    const currentProblemIndex = problems.findIndex((p) => p._id === (problemname?.slice(0, 24) as string));
    if (currentProblemIndex === 0) {
      navigate(`/problems/${problems[problems.length - 1]._id}${problems.length}`);
    } else {
      const previousProblem = problems[currentProblemIndex - 1];
      navigate(`/problems/${previousProblem._id}${currentProblemIndex}`);
    }
  }, [problems.length]);

  const randomProblemHandler = useCallback(() => {
    const randomIndex = getRandomIndex(problems.length);
    navigate(`/problems/${problems[randomIndex]._id}${randomIndex + 1}`);
  }, [problems]);

  const problemsRange = useMemo(() => {
    const currentProblemIndex = problems.findIndex((p) => p._id === (problemname?.slice(0, 24) as string));
    const { start, end } = getProblemWindow(currentProblemIndex, problems.length);
    return problems.slice(start, end);
  }, [problems.length, problemname]);

  const colorStyles = useMemo(() => ({ color: colorMode === 'dark' ? 'common.white' : 'common.black' }), [colorMode]);

  return (
    <>
      {problems.length > 0 && <CustomDrawer problems={problemsRange} open={openDrawer} toggleDrawer={toggleDrawer} />}
      <nav className='tw-border-b-[#ffffff24]'>
        <ul
          className={`tw-container-md tw-flex ${location.pathname.includes('/problems/') ? 'tw-justify-between' : 'tw-justify-evenly'} tw-mx-2 tw-items-center tw-list-none tw-p-1`}
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
                  <Button title='Expand Panel' sx={colorStyles} onClick={() => toggleDrawerVisiblility()}>
                    <Stack gap='2' alignItems='center' flexDirection='row'>
                      <span>
                        <DoubleArrowOutlinedIcon sx={colorStyles} fontSize='small' />
                      </span>
                      <Typography variant='body2'>Problem List</Typography>
                    </Stack>
                  </Button>
                  <Button sx={colorStyles} title='Prev Question' size='small' onClick={problemPreviousPage}>
                    <ChevronLeftOutlined sx={colorStyles} fontSize='small'></ChevronLeftOutlined>
                  </Button>
                  <Button sx={colorStyles} title='Next Question' size='small' onClick={problemNextPageHandler}>
                    <ChevronRightOutlined sx={colorStyles} fontSize='small'></ChevronRightOutlined>
                  </Button>
                  <Button sx={colorStyles} title='Pick One' size='small' onClick={randomProblemHandler}>
                    <ShuffleOutlinedIcon sx={colorStyles} fontSize='small' />
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
                    <Button variant='outlined' sx={colorStyles}>
                      <Stack direction={'row'} alignItems='center' spacing={2}>
                        <Typography variant='body2'> Pending</Typography>
                        <CircularProgress size='25px' color='inherit' />
                      </Stack>
                    </Button>
                  ) : (
                    <>
                      <Button sx={colorStyles} color='primary' onClick={problemExecuteHandler}>
                        <Stack direction={'row'} alignItems='center' spacing={2}>
                          <PlayArrowIcon fontSize='small' />
                          <Typography variant='body2'>Run</Typography>
                        </Stack>
                      </Button>
                      <Button sx={colorStyles} onClick={problemSubmitHandler}>
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
                  {!location.pathname.includes('/signin') && (
                    <Link
                      className={`tw-py-2 tw-px-4 ${colorMode === 'dark' ? 'tw-text-white' : ''}`}
                      underline='hover'
                      component={ReactLink}
                      to='/signin'
                    >
                      Sign in
                    </Link>
                  )}
                  {!location.pathname.includes('/signup') && !location.pathname.includes('/signin') && <span>or</span>}
                  {!location.pathname.includes('/signup') && (
                    <Link
                      className={`tw-py-2 tw-px-4 ${colorMode === 'dark' ? 'tw-text-white' : ''}`}
                      underline='hover'
                      component={ReactLink}
                      to='/signup'
                    >
                      Sign up
                    </Link>
                  )}
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
                {colorMode === 'dark' ? (
                  <LightModeIcon sx={{ width: 32, height: 32, color: 'white' }} />
                ) : (
                  <DarkModeIcon sx={{ width: 32, height: 32 }} />
                )}
              </Button>
            </li>
          </ul>
        </ul>
      </nav>
    </>
  );
}
