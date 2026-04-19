import { Link as ReactLink, useLocation, useNavigate } from 'react-router-dom';
import darklogo from '../../../assets/images/logo-dark.26900637.svg';
import lightlogo from '../../../assets/images/logo-light.5034df26.svg';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { Button, Link } from '@mui/material';
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

  // Handle autocomplete selection - navigate to problems list with search query maintained
  const handleAutocompleteSelect = useCallback(
    (_: MappedSearchResult) => {
      // Keep the search query in store and navigate to problems list
      navigate('/problems');
    },
    [navigate]
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  return (
    <nav className='tw-container-lg tw-mx-auto tw-flex tw-items-center tw-justify-between tw-p-2 tw-bottom-2 tw-border-b-[#ffffff24] tw-gap-4'>
      {/* Logo */}
      <div className='tw-flex-shrink-0'>
        <img
          src={colorMode === 'light' ? darklogo : lightlogo}
          width={100}
          height={80}
          className='tw-object-contain'
        ></img>
      </div>

      {/* Center Content - Autocomplete or Navigation */}
      <div className='tw-flex-1 tw-flex tw-items-center tw-justify-center'>
        {/* Problem Autocomplete - Show only on home page */}
        {location.pathname === '/' && isLogedIn && (
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

        {/* Navigation Links - Show on other pages */}
        {(location.pathname === '/leaderboard' || location.pathname === '/problems') && (
          <Link
            className={`tw-py-2 tw-px-4 ${colorMode === 'dark' ? 'tw-text-white' : ''}`}
            underline='hover'
            component={ReactLink}
            to='/'
          >
            Problems
          </Link>
        )}
        {location.pathname !== '/' && location.pathname !== '/leaderboard' && location.pathname !== '/problems' && (
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
