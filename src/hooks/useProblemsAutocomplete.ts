/**
 * Hook for managing autocomplete search with React Query
 * Only accepts search query - difficulty filtering is separate
 * Returns both top 5 results for dropdown and all results for table
 */

import { useQuery } from '@tanstack/react-query';
import { searchProblems } from '../services/searchProblems';
import useDebounce from './useDebounce';
import { MappedSearchResult } from '../utils/elasticsearchMapper';

interface UseProblemsAutocompleteReturn {
  topResults: MappedSearchResult[];
  allResults: MappedSearchResult[];
  totalResults: number;
  isSearching: boolean;
  error: Error | null;
}

/**
 * Manages autocomplete search with React Query
 * - Single query with fast debounce (200ms)
 * - Only accepts search query (no difficulty parameter)
 * - Returns top 5 for autocomplete dropdown
 * - Returns all results for table (client-side status filtering applied)
 * - Supports pagination with page and limit
 *
 * Note: Difficulty filtering is handled separately - passed directly to searchProblems
 * when needed for table results. This hook only handles query-based search.
 *
 * @param searchQuery - Raw search input from user
 * @param page - Current page number (1-indexed)
 * @param limit - Items per page (default: 10)
 * @returns Object with topResults, allResults, loading state, and errors
 */
export const useProblemsAutocomplete = (
  searchQuery: string,
  page: number = 1,
  limit: number = 10
): UseProblemsAutocompleteReturn => {
  // Fast debounce for search (200ms)
  const debouncedQuery = useDebounce(searchQuery, 200);

  // Single Query: Search results by query only (no difficulty)
  const {
    data: searchData,
    isLoading: isSearching,
    error,
  } = useQuery({
    queryKey: ['problems-search', { query: debouncedQuery.trim(), page, limit }],
    queryFn: ({ queryKey }) => {
      // queryKey contains: ['problems-search', { query, page, limit }]
      const {
        query: queryVal,
        page: pageVal,
        limit: limitVal,
      } = queryKey[1] as { query: string; page: number; limit: number };
      return searchProblems(pageVal, limitVal, queryVal);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    enabled: debouncedQuery.trim().length > 0, // Only fetch when user types
    refetchOnWindowFocus: false,
  });

  return {
    topResults: searchData?.topResults || [],
    allResults: searchData?.allResults || [],
    totalResults: searchData?.totalResults || 0,
    isSearching,
    error,
  };
};

export default useProblemsAutocomplete;
