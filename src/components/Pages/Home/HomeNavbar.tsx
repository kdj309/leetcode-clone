import { Link as ReactLink, useLocation, useNavigate } from 'react-router-dom';
import darklogo from '../../../assets/images/logo-dark.26900637.svg';
import lightlogo from '../../../assets/images/logo-light.5034df26.svg';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link'
import { useAuthSlice } from '../../../store/authslice/auth';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import Profile from '../../UI/Profile';
import { useCallback } from 'react';
import ProblemAutocomplete from '../Problems/ProblemAutocomplete';
import useProblemsAutocomplete from '../../../hooks/useProblemsAutocomplete';
import { MappedSearchResult } from '../../../utils/elasticsearchMapper';
import { useProblemsSearchSlice } from '../../../store/problemsSearchSlice';

export default function HomeNavbar() {
  const { colorMode, toggleColorMode } = usethemeUtils();
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);
  const location = useLocation();
  const navigate = useNavigate();

  // Use Zustand store for search state (synced across pages)
  const searchQuery = useProblemsSearchSlice((state) => state.searchQuery);
  const setSearchQuery = useProblemsSearchSlice((state) => state.setSearchQuery);

  const { topResults, isSearching } = useProblemsAutocomplete(searchQuery);

  const handleAutocompleteSelect = useCallback(
    (_: MappedSearchResult) => {
      navigate(`/problems/${_.id}`);
    },
    [navigate]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery]
  );

  const showHomeSearch = location.pathname === '/' && isLogedIn;

  return (
    <nav className='tw-container-lg tw-mx-auto tw-flex tw-items-center tw-justify-between tw-p-2 tw-bottom-2 tw-border-b-[#ffffff24] tw-gap-4'>
      {/* Logo */}
      <Link component={ReactLink} to='/'>
        <div className='tw-flex-shrink-0'>
          <img src={colorMode === 'light' ? darklogo : lightlogo} className='tw-object-contain logo-img'></img>
        </div>
      </Link>

      {/* Center Content - Autocomplete or Navigation */}
      <div className='tw-flex-1 tw-flex tw-items-center tw-justify-center'>
        {/* Problem Autocomplete - Show only on home page */}
        {showHomeSearch && (
          <div className='tw-w-full tw-max-w-2xl'>
            <ProblemAutocomplete
              topResults={topResults}
              isSearching={isSearching}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onSelect={handleAutocompleteSelect}
              maxWidth='100%'
            />
          </div>
        )}

        {/* Navigation Links */}
        {location.pathname === '/' ? (
          <div className='tw-flex tw-gap-4'>
            <Link
              className={`tw-py-2 tw-px-4 ${colorMode === 'dark' ? 'tw-text-white' : ''}`}
              underline='hover'
              component={ReactLink}
              to='/leaderboard'
            >
              Leaderboard
            </Link>
          </div>
        ) : location.pathname === '/leaderboard' ? (
          <div className='tw-flex tw-gap-4'>
            <Link
              className={`tw-py-2 tw-px-4 ${colorMode === 'dark' ? 'tw-text-white' : ''}`}
              underline='hover'
              component={ReactLink}
              to='/'
            >
              Problems
            </Link>
          </div>
        ) : location.pathname === '/problems' ? (
          <div className='tw-flex tw-gap-4'>
            <Link
              className={`tw-py-2 tw-px-4 ${colorMode === 'dark' ? 'tw-text-white' : ''}`}
              underline='hover'
              component={ReactLink}
              to='/leaderboard'
            >
              Leaderboard
            </Link>
          </div>
        ) : (
          <div className='tw-flex tw-gap-4'>
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
          </div>
        )}
      </div>

      {/* Right Side - Auth & Theme */}
      <ul className='tw-list-none tw-flex tw-items-center tw-gap-2 tw-flex-shrink-0'>
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
          <Button className={colorMode === 'dark' ? 'tw-border-white' : ''} variant='text' onClick={toggleColorMode}>
            {colorMode === 'dark' ? (
              <LightModeOutlinedIcon sx={{ color: 'white', width: 32, height: 32 }} />
            ) : (
              <DarkModeIcon sx={{ width: 32, height: 32 }} />
            )}
          </Button>
        </li>
      </ul>
    </nav>
  );
}
