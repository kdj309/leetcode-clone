import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Problem } from '../../../utils/types';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';
import ProblemsTable from './ProblemsTable';
import { Link } from 'react-router-dom';
import { difficultyColors } from '../../../constants/Index';
import { isAccepted, isRejected } from '../../../utils/helpers';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import { useUserSlice } from '../../../store/user';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { capitalize, SelectChangeEvent } from '@mui/material';
import { useAuthContext } from '../../../context/AuthContext';
import { useProblemSlice } from '../../../store/problemSlice/problem';
import { useProblemsAutocomplete } from '../../../hooks/useProblemsAutocomplete';
import { useProblemsSearchSlice } from '../../../store/problemsSearchSlice';
import { useAuthSlice } from '../../../store/authslice/auth';
import { searchProblems } from '../../../services/searchProblems';
import useDebounce from '../../../hooks/useDebounce';
import getProblems from '../../../services/getProblems';

export default function ProblemsSet() {
  const [open, setOpen] = useState<boolean>(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { isError, isLoading, error } = useAuthContext();
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);

  // Get search query and clear function from Zustand store
  const searchQuery = useProblemsSearchSlice((state) => state.searchQuery);
  const clearSearchQuery = useProblemsSearchSlice((state) => state.clearSearchQuery);

  const handleClose = () => {
    setOpen(false);
  };

  // Pagination settings (limit set to 10 per page)
  const LIMIT = 10;
  const [paginationState, setPaginationState] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Compute page number from paginationState (ensures it's always a number)
  const page = useMemo(() => Math.floor(paginationState.pageIndex) + 1, [paginationState.pageIndex]);

  // Use autocomplete hook for search - only query parameter (no difficulty)
  const { allResults, totalResults: autocompleteTotal, isSearching } = useProblemsAutocomplete(searchQuery, page, LIMIT);

  // Separate query for difficulty-filtered results (works independently of search)
  // Enabled whenever difficulty is selected (any value other than 'all')
  const debouncedQuery = useDebounce(searchQuery, 200);
  const {
    data: difficultyFilteredData,
    isLoading: isDifficultyFiltering,
  } = useQuery({
    queryKey: ['problems-search', { query: debouncedQuery.trim(), difficulty: difficultyFilter, page, limit: LIMIT }],
    queryFn: async ({ queryKey }) => {
      // queryKey contains: ['problems-search', { query, difficulty, page, limit }]
      const { query: queryVal, difficulty: diffVal, page: pageVal, limit: limitVal } = queryKey[1] as { query: string; difficulty: string; page: number; limit: number };
      return searchProblems(pageVal, limitVal, queryVal, diffVal);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: difficultyFilter !== 'all', // Independent of search query - enabled whenever difficulty is selected
    refetchOnWindowFocus: false,
  });

  // Query for default paginated problems (when no search/difficulty filter)
  const {
    data: defaultProblemsData,
    isLoading: isDefaultProblemsLoading,
  } = useQuery({
    queryKey: ['problems-default', { page, limit: LIMIT }],
    queryFn: async ({ queryKey }) => { 
      // queryKey contains: ['problems-default', { page, limit }]
      const objAtIndex1 = queryKey[1];
      const { page: pageVal, limit: limitVal } = objAtIndex1 as { page: number; limit: number };
      return getProblems(pageVal, limitVal); 
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    // Only fetch when: no search query AND no difficulty filter
    enabled: searchQuery.trim().length === 0 && difficultyFilter === 'all',
    refetchOnWindowFocus: false,
  });

  // Update slice with paginated problems for Navbar random navigation
  const { setProblems } = useProblemSlice();
  useEffect(() => {
    if (defaultProblemsData?.problems && defaultProblemsData.problems.length > 0) {
      setProblems(defaultProblemsData.problems);
    }
  }, [defaultProblemsData?.problems, setProblems]);

  const tableData = useMemo(() => {
    // Determine which data source to use
    if (searchQuery.trim().length > 0) {
      // Search results - map MappedSearchResult to Problem-like shape for table
      return allResults.map(result => ({
        _id: result.id,
        title: result.title,
        difficulty: result.difficulty || 'easy',
        status: 'default',
      })) as unknown as Problem[];
    } else if (difficultyFilter !== 'all') {
      // Difficulty filtered - map MappedSearchResult to Problem-like shape
      return (difficultyFilteredData?.allResults || []).map(result => ({
        _id: result.id,
        title: result.title,
        difficulty: result.difficulty || 'easy',
        status: 'default',
      })) as unknown as Problem[];
    } else {
      // Default: use all problems from defaultProblemsData (already full Problem objects)
      return defaultProblemsData?.problems || [];
    }
  }, [searchQuery, difficultyFilter, allResults, difficultyFilteredData?.allResults, defaultProblemsData?.problems]);
  const columnHelper = createColumnHelper<Problem>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const user = useUserSlice((state) => state.user);

  const columns = useMemo(
    () => [
      // Status column - only for logged in users
      ...(isLogedIn
        ? [
          columnHelper.accessor((row) => row.status, {
            id: 'Status',
            cell: (info) => {
              let icon;
              if (user) {
                icon = isAccepted(info.row.original._id, user?.submissions) ? (
                  <TaskAltOutlinedIcon titleAccess='Solved' color='success' />
                ) : isRejected(info.row.original._id, user?.submissions) ? (
                  <PendingOutlinedIcon titleAccess='Attempted' color='warning' />
                ) : null;
              } else {
                icon = null;
              }
              return <div> {icon}</div>;
            },
            filterFn: 'statusFilter' as any,
          }),
        ]
        : []),
      columnHelper.accessor((row) => row.title, {
        id: 'Title',
        cell: (info) => {
          return (
            <Link to={`/problems/${info.row.original._id}${info.row.index + 1}`}>
              {info.row.index + 1}. {info.getValue()}
            </Link>
          );
        },
      }),
      columnHelper.accessor((row) => row.difficulty, {
        id: 'Difficulty',
        cell: (info) => {
          return <div style={{ color: difficultyColors[info.getValue()] }}>{capitalize(info.getValue())}</div>;
        },
      }),
    ],
    [user, isLogedIn]
  );
  const totalResultsValue = searchQuery.trim().length > 0
    ? autocompleteTotal // Search results
    : difficultyFilter !== 'all'
      ? (difficultyFilteredData?.totalResults || 0) // Difficulty filtered
      : (defaultProblemsData?.total || 0); // Default problems
  const totalPages = Math.ceil(totalResultsValue / LIMIT);

  // Handle pagination change from React Table
  const handlePaginationChange = (updater: any) => {
    setPaginationState((prev) =>
      typeof updater === 'function' ? updater(prev) : updater
    );
  };

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    // NOTE: Removed getPaginationRowModel() and getFilteredRowModel() for server-side pagination
    // Server handles pagination and filtering, no need for client-side models
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: handlePaginationChange, // Use the handler that properly processes the updater
    manualPagination: true, // Tell React Table pagination is handled server-side
    pageCount: totalPages, // Calculate based on server total
    state: {
      columnFilters,
      pagination: paginationState,
    },
    filterFns: {
      statusFilter: (row, _columnId, filterValue) => {
        if (!isLogedIn) return true; // If not logged in, don't filter

        const acceptedProblems = [
          ...new Set(user?.submissions.filter((s) => s.status === 'Accepted').map((s) => s.problemId)),
        ];
        const rejectedProblems = [
          ...new Set(user?.submissions.filter((s) => s.status === 'Wrong Answer').map((s) => s.problemId)),
        ];
        const onlyRejectProblems = rejectedProblems.filter((id) => !acceptedProblems.includes(id));
        if (filterValue === 'solved') {
          return acceptedProblems?.includes(row.original._id);
        } else if (filterValue === 'attempted') {
          return onlyRejectProblems?.includes(row.original._id);
        } else if (filterValue === 'todo') {
          return !onlyRejectProblems?.includes(row.original._id) && !acceptedProblems.includes(row.original._id);
        }
        return true;
      },
    },
  });
  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setDifficultyFilter(event.target.value);
    // Difficulty is now handled server-side, no need to set table filter
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    table.getColumn('Status')?.setFilterValue(event.target.value);
  };

  // Clear filters when search query is cleared
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setStatusFilter('all');
      table.getColumn('Status')?.setFilterValue('all');
    }
  }, [searchQuery]);

  if (isLoading) {
    return (
      <>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </>
    );
  }

  if (isError) {
    return <p>{error?.message}</p>;
  }

  return (
    <>
      <ProblemsTable
        handleStatusChange={handleStatusChange}
        difficultyFilter={difficultyFilter}
        statusFilter={statusFilter}
        handleDifficultChange={handleDifficultyChange}
        table={table}
        data={tableData || []}
        isTableLoading={isSearching || isDifficultyFiltering || isDefaultProblemsLoading}
        isLogedIn={isLogedIn}
        totalCount={totalResultsValue}
        reset={() => {
          clearSearchQuery();
          setStatusFilter('all');
          setDifficultyFilter('all');
          setPaginationState({ pageIndex: 0, pageSize: 10 }); // Reset to first page
          table.getColumn('Status')?.setFilterValue('all');
        }}
      />
    </>
  );
}
