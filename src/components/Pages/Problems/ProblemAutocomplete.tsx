/**
 * Problem Typeahead/Autocomplete Component
 * Displays top 5 search results with keyboard navigation and direct problem linking
 */

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import useTheme from '@mui/material/styles/useTheme';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { MappedSearchResult } from '../../../utils/elasticsearchMapper';
import SearchIcon from '@mui/icons-material/Search';

interface ProblemAutocompleteProps {
  topResults: MappedSearchResult[];
  isSearching: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelect: (problem: MappedSearchResult) => void;
  maxWidth?: string;
}

export default function ProblemAutocomplete({
  topResults,
  isSearching,
  searchQuery,
  onSearchChange,
  onSelect,
  maxWidth = '500px',
}: ProblemAutocompleteProps) {
  const theme = useTheme();
  const { colorMode } = usethemeUtils();

  const handleSelect = (_: React.SyntheticEvent, value: MappedSearchResult | string | null) => {
    if (value && typeof value === 'object') {
      onSelect(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      const autocompleteElement = event.currentTarget as HTMLDivElement;
      const activeOption = autocompleteElement.querySelector('[role="option"][data-option-index="0"]');

      if (activeOption) {
        (event.currentTarget as unknown as { blur: () => void }).blur?.();
      }
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth }}>
      <Autocomplete
        freeSolo
        options={topResults}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.title)}
        inputValue={searchQuery}
        onInputChange={(_, value) => onSearchChange(value)}
        onChange={handleSelect}
        loading={isSearching}
        noOptionsText={
          searchQuery.trim().length === 0
            ? 'Start typing to search problems...'
            : isSearching
              ? 'Searching...'
              : 'No problems found'
        }
        onKeyDown={handleKeyDown}
        isOptionEqualToValue={(option, value) => (typeof value === 'string' ? false : option.id === value.id)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder='Search problems'
            variant='outlined'
            size='small'
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                  <SearchIcon
                    sx={{
                      fontSize: 20,
                      color: colorMode === 'dark' ? theme.palette.text.secondary : theme.palette.action.active,
                    }}
                  />
                </Box>
              ),
              endAdornment: (
                <>
                  {isSearching && <CircularProgress color='inherit' size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: colorMode === 'dark' ? theme.palette.background.paper : '#f9f9f9',
                '&:hover': {
                  backgroundColor: theme.palette.background.paper,
                },
              },
            }}
          />
        )}
        renderOption={(props, option) => (
          <Box
            component='li'
            {...props}
            key={option.id}
            sx={{
              py: 1,
              px: 2,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <Box
              sx={{
                fontSize: '0.95rem',
                fontWeight: 500,
                color: theme.palette.text.primary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}
            >
              {option.title}
            </Box>
          </Box>
        )}
        ListboxProps={{
          sx: {
            maxHeight: '300px',
            '& li': {
              py: 1,
            },
          },
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: colorMode === 'dark' ? theme.palette.background.paper : theme.palette.background.default,
              boxShadow: colorMode === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
            },
          },
        }}
      />
    </Box>
  );
}
