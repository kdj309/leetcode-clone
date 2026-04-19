import { create } from 'zustand';

interface ProblemsSearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearchQuery: () => void;
}

export const useProblemsSearchSlice = create<ProblemsSearchState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  clearSearchQuery: () => set({ searchQuery: '' }),
}));
