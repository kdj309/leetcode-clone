import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Problem } from '../../../utils/types';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
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
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
export default function ProblemsSet() {
  const [open, setOpen] = useState<boolean>(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { isError, isLoading, error } = useAuthContext();
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);
  const searchQuery = useProblemsSearchSlice((state) => state.searchQuery);
  const clearSearchQuery = useProblemsSearchSlice((state) => state.clearSearchQuery);
  const user = useUserSlice((state) => state.user);

  const handleClose = () => {
    setOpen(false);
  };

  const [paginationState, setPaginationState] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Compute page number from paginationState (ensures it's always a number)
  const page = useMemo(() => Math.floor(paginationState.pageIndex) + 1, [paginationState.pageIndex]);

  const { pageSize } = paginationState;

  // Use autocomplete hook for search - only query parameter (no difficulty)
  const {
    allResults,
    totalResults: autocompleteTotal,
    isSearching,
  } = useProblemsAutocomplete(searchQuery, page, pageSize);

  const debouncedQuery = useDebounce(searchQuery, 200);
  const { data: difficultyFilteredData, isLoading: isDifficultyFiltering } = useQuery({
    queryKey: [
      'problems-search',
      { query: debouncedQuery.trim(), difficulty: difficultyFilter, page, limit: pageSize },
    ],
    queryFn: ({ queryKey }) => {
      const {
        query: queryVal,
        difficulty: diffVal,
        page: pageVal,
        limit: limitVal,
      } = queryKey[1] as { query: string; difficulty: string; page: number; limit: number };
      return searchProblems(pageVal, limitVal, queryVal, diffVal);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: difficultyFilter !== 'all',
    refetchOnWindowFocus: false,
  });

  // Query for default paginated problems (when no search/difficulty filter)
  const { data: defaultProblemsData, isLoading: isDefaultProblemsLoading } = useQuery({
    queryKey: ['problems-default', { page, limit: pageSize }],
    queryFn: ({ queryKey }) => {
      const [_, objAtIndex1] = queryKey;
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
    if (searchQuery.trim().length > 0) {
      // Search results - map MappedSearchResult to Problem-like shape for table
      return allResults.map((result) => ({
        _id: result.id,
        title: result.title,
        difficulty: result.difficulty || 'easy',
        status: isLogedIn ? (user?.submissions.find((p) => p.problemId == result.id)?.status ?? 'todo') : 'todo',
      })) as unknown as Problem[];
    } else if (difficultyFilter !== 'all') {
      // Difficulty filtered - map MappedSearchResult to Problem-like shape
      return (difficultyFilteredData?.allResults || []).map((result) => ({
        _id: result.id,
        title: result.title,
        difficulty: result.difficulty || 'easy',
        status: isLogedIn ? (user?.submissions.find((p) => p.problemId == result.id)?.status ?? 'todo') : 'todo',
      })) as unknown as Problem[];
    }
    return defaultProblemsData?.problems || [];
  }, [
    searchQuery,
    difficultyFilter,
    allResults,
    difficultyFilteredData?.allResults,
    defaultProblemsData?.problems,
    user,
  ]);
  const columnHelper = createColumnHelper<Problem>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo(
    () => [
      ...(isLogedIn
        ? [
            columnHelper.accessor((row) => row.status, {
              id: 'Status',
              cell: (info) => {
                if (user) {
                  if (isAccepted(info.row.original._id, user?.submissions)) {
                    return (
                      <div>
                        {' '}
                        <TaskAltOutlinedIcon titleAccess='Solved' color='success' />
                      </div>
                    );
                  } else if (isRejected(info.row.original._id, user?.submissions)) {
                    return (
                      <div>
                        <PendingOutlinedIcon titleAccess='Attempted' color='warning' />
                      </div>
                    );
                  }
                  return (
                    <div>
                      <PlaylistAddOutlinedIcon titleAccess='To Do' color='action'></PlaylistAddOutlinedIcon>
                    </div>
                  );
                }
                return null;
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
  const totalResultsValue =
    searchQuery.trim().length > 0
      ? autocompleteTotal // Search results
      : difficultyFilter !== 'all'
        ? difficultyFilteredData?.totalResults || 0 // Difficulty filtered
        : defaultProblemsData?.total || 0; // Default problems
  const totalPages = Math.ceil(totalResultsValue / pageSize);

  // Handle pagination change from React Table
  const handlePaginationChange = (updater: any) => {
    setPaginationState((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  };

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: handlePaginationChange,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      columnFilters,
      pagination: paginationState,
    },
    filterFns: {
      statusFilter: (row, _columnId, filterValue) => {
        if (!isLogedIn) {
          return true;
        }

        const acceptedProblems = [
          ...new Set(user?.submissions.filter((s) => s.status.toLowerCase() === 'accepted').map((s) => s.problemId)),
        ];
        const rejectedProblems = [
          ...new Set(
            user?.submissions.filter((s) => s.status.toLowerCase() === 'wrong answer').map((s) => s.problemId)
          ),
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
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    const nextValue = event.target.value;
    setStatusFilter(nextValue);
    table.getColumn('Status')?.setFilterValue(nextValue);
  };

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
