import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ProblemsSearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearchQuery: () => void;
}

export const useProblemsSearchSlice = create<ProblemsSearchState>()(
  devtools(
    (set) => ({
      searchQuery: '',
      setSearchQuery: (query: string) => set({ searchQuery: query }, false, 'setSearchQuery'),
      clearSearchQuery: () => set({ searchQuery: '' }, false, 'clearSearchQuery'),
    }),
    { name: 'problemsSearchSlice' }
  )
);
