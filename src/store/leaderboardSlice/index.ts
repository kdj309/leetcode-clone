import { create } from 'zustand';
import {
  LeaderboardState,
  LeaderboardUser,
  LeaderboardFilters,
  TimePeriod,
  DifficultyFilter,
  SortBy,
  SortOrder,
  ViewMode,
  UpdateEvent,
} from '../../utils/types';

interface LeaderboardActions {
  // Data actions
  setLeaderboardUsers: (users: LeaderboardUser[], lastFetched: Date) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Pagination actions
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  setPageSize: (size: number) => void;
  setPaginationState: (pagination: Partial<Omit<LeaderboardState['pagination'], 'pageSize' | 'currentPage'>>) => void;

  // Filter actions
  setTimePeriod: (period: TimePeriod) => void;
  setSearchQuery: (query: string) => void;
  setDifficultyFilter: (difficulty: DifficultyFilter) => void;
  toggleOnlineOnly: () => void;
  clearFilters: () => void;
  applyFilters: (filters: Partial<LeaderboardFilters>) => void;

  // User actions
  setCurrentUser: (userId: string | null) => void;
  setCurrentUserRank: (rank: number | null) => void;
  highlightUser: (userId: string | null) => void;

  // UI actions
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleAutoRefresh: () => void;
  setRefreshInterval: (seconds: number) => void;

  // Cache actions
  cachePage: (pageNumber: number, data: LeaderboardUser[]) => void;
  getCachedPage: (pageNumber: number) => LeaderboardUser[] | null;
  clearCache: () => void;
  invalidateCache: () => void;

  // Realtime actions
  setRealtimeConnected: (connected: boolean) => void;
  updateRealtimeData: (updates: UpdateEvent[]) => void;
  clearPendingUpdates: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;

  // Batch actions
  resetLeaderboard: () => void;
}

interface LeaderboardComputed {
  rankedUsers: () => LeaderboardUser[];
  topThreeUsers: () => LeaderboardUser[];
  filteredUsers: () => LeaderboardUser[];
  visibleUsers: () => LeaderboardUser[];
  getCurrentUserStats: () => LeaderboardUser | null;
  getUserById: (userId: string) => LeaderboardUser | null;
  getNearbyRanks: (rank: number, range: number) => LeaderboardUser[];
  getUserRankChange: (userId: string) => number;
  getUserPercentile: (userId: string) => number;
  isUserInTopTen: (userId: string) => boolean;
  isDataStale: () => boolean;
  searchResults: () => LeaderboardUser[];
}

const INITIAL_STATE: LeaderboardState = {
  leaderboardData: {
    users: [],
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    pageSize: 50,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    timePeriod: 'all',
    searchQuery: '',
    difficultyFilter: 'all',
    showOnlineOnly: false,
  },
  currentUserId: null,
  currentUserRank: null,
  ui: {
    viewMode: 'table',
    sortBy: 'rank',
    sortOrder: 'asc',
    highlightedUserId: null,
    autoRefresh: false,
    refreshInterval: 30,
  },
  realtime: {
    isConnected: false,
    lastUpdate: null,
    pendingUpdates: [],
    notificationsEnabled: true,
  },
  cache: {
    pageCache: new Map(),
    lastCacheCleared: null,
    cacheDuration: 5 * 60 * 1000,
  },
};

export const useLeaderboardStore = create<LeaderboardState & LeaderboardActions & LeaderboardComputed>()(
  (set, get) => ({
    ...INITIAL_STATE,

    setLeaderboardUsers: (users, lastFetched) => {
      set((state) => ({
        leaderboardData: {
          ...state.leaderboardData,
          users,
          lastFetched,
          isLoading: false,
        },
        pagination: {
          ...state.pagination,
          totalUsers: users.length,
        },
      }));
    },

    setLoading: (isLoading) =>
      set((state) => ({
        leaderboardData: { ...state.leaderboardData, isLoading },
      })),

    setError: (error) =>
      set((state) => ({
        leaderboardData: { ...state.leaderboardData, error },
      })),

    clearError: () =>
      set((state) => ({
        leaderboardData: { ...state.leaderboardData, error: null },
      })),

    setCurrentPage: (page) =>
      set((state) => ({
        pagination: {
          ...state.pagination,
          currentPage: Math.max(1, Math.min(page, state.pagination.totalPages)),
          hasPrevPage: page > 1,
          hasNextPage: page < state.pagination.totalPages,
        },
      })),

    nextPage: () => {
      const state = get();
      if (state.pagination.hasNextPage) {
        state.setCurrentPage(state.pagination.currentPage + 1);
      }
    },

    prevPage: () => {
      const state = get();
      if (state.pagination.hasPrevPage) {
        state.setCurrentPage(state.pagination.currentPage - 1);
      }
    },

    goToFirstPage: () => get().setCurrentPage(1),

    goToLastPage: () => get().setCurrentPage(get().pagination.totalPages),

    setPageSize: (size) =>
      set((state) => ({
        pagination: {
          ...state.pagination,
          pageSize: size,
          currentPage: 1,
          totalPages: Math.ceil(state.pagination.totalUsers / size),
        },
      })),

    setPaginationState: (pagination) =>
      set((state) => ({
        pagination: { ...state.pagination, ...pagination },
      })),

    setTimePeriod: (period) =>
      set((state) => ({
        filters: { ...state.filters, timePeriod: period },
      })),

    setSearchQuery: (query) =>
      set((state) => ({
        filters: { ...state.filters, searchQuery: query },
      })),

    setDifficultyFilter: (difficulty) =>
      set((state) => ({
        filters: { ...state.filters, difficultyFilter: difficulty },
      })),

    toggleOnlineOnly: () =>
      set((state) => ({
        filters: {
          ...state.filters,
          showOnlineOnly: !state.filters.showOnlineOnly,
        },
      })),

    clearFilters: () =>
      set({
        filters: {
          timePeriod: 'all',
          searchQuery: '',
          difficultyFilter: 'all',
          showOnlineOnly: false,
        },
      }),

    applyFilters: (filters) =>
      set((state) => ({
        filters: { ...state.filters, ...filters },
        pagination: { ...state.pagination, currentPage: 1 },
      })),

    setCurrentUser: (userId) => set({ currentUserId: userId }),

    setCurrentUserRank: (rank) => set({ currentUserRank: rank }),

    highlightUser: (userId) =>
      set((state) => ({
        ui: { ...state.ui, highlightedUserId: userId },
      })),

    setViewMode: (mode) =>
      set((state) => ({
        ui: { ...state.ui, viewMode: mode },
      })),

    setSortBy: (sortBy) =>
      set((state) => ({
        ui: { ...state.ui, sortBy },
      })),

    setSortOrder: (order) =>
      set((state) => ({
        ui: { ...state.ui, sortOrder: order },
      })),

    toggleAutoRefresh: () =>
      set((state) => ({
        ui: { ...state.ui, autoRefresh: !state.ui.autoRefresh },
      })),

    setRefreshInterval: (seconds) =>
      set((state) => ({
        ui: { ...state.ui, refreshInterval: seconds },
      })),

    cachePage: (pageNumber, data) =>
      set((state) => {
        const newPageCache = new Map(state.cache.pageCache);
        newPageCache.set(pageNumber, data);
        return {
          cache: { ...state.cache, pageCache: newPageCache },
        };
      }),

    getCachedPage: (pageNumber) => {
      const state = get();
      const cached = state.cache.pageCache.get(pageNumber);
      if (!cached) return null;
      const lastCleared = state.cache.lastCacheCleared;
      if (lastCleared && Date.now() - lastCleared.getTime() > state.cache.cacheDuration) {
        return null;
      }
      return cached;
    },

    clearCache: () =>
      set((state) => ({
        cache: {
          ...state.cache,
          pageCache: new Map(),
          lastCacheCleared: new Date(),
        },
      })),

    invalidateCache: () => {
      get().clearCache();
    },

    setRealtimeConnected: (connected) =>
      set((state) => ({
        realtime: { ...state.realtime, isConnected: connected },
      })),

    updateRealtimeData: (updates) =>
      set((state) => ({
        realtime: {
          ...state.realtime,
          pendingUpdates: [...state.realtime.pendingUpdates, ...updates],
          lastUpdate: new Date(),
        },
      })),

    clearPendingUpdates: () =>
      set((state) => ({
        realtime: { ...state.realtime, pendingUpdates: [] },
      })),

    setNotificationsEnabled: (enabled) =>
      set((state) => ({
        realtime: { ...state.realtime, notificationsEnabled: enabled },
      })),

    resetLeaderboard: () => set(INITIAL_STATE),

    rankedUsers: () => {
      const state = get();
      return state.leaderboardData.users.filter((u) => u.totalPoints > 0);
    },

    topThreeUsers: () => {
      const state = get();
      return state.leaderboardData.users.slice(0, 3);
    },

    filteredUsers: () => {
      const state = get();
      let filtered = [...state.leaderboardData.users];

      if (state.filters.difficultyFilter !== 'all') {
        filtered = filtered.filter((user) => {
          const difficulty = state.filters.difficultyFilter;
          if (difficulty === 'easy') return user.easyProblems > 0;
          if (difficulty === 'medium') return user.mediumProblems > 0;
          if (difficulty === 'hard') return user.hardProblems > 0;
          return true;
        });
      }

      if (state.filters.showOnlineOnly) {
        filtered = filtered.filter((u) => u.isOnline);
      }

      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase();
        filtered = filtered.filter((u) => u.userId.username.toLowerCase().includes(query));
      }

      return filtered;
    },

    visibleUsers: () => {
      const state = get();
      const filtered = get().filteredUsers();
      const start = (state.pagination.currentPage - 1) * state.pagination.pageSize;
      const end = start + state.pagination.pageSize;
      return filtered.slice(start, end);
    },

    getCurrentUserStats: () => {
      const state = get();
      if (!state.currentUserId) return null;
      return state.leaderboardData.users.find((u) => u.userId._id === state.currentUserId) || null;
    },

    getUserById: (userId: string) => {
      const state = get();
      return state.leaderboardData.users.find((u) => u.userId._id === userId) || null;
    },

    getNearbyRanks: (rank: number, range: number = 5) => {
      const state = get();
      const start = Math.max(0, rank - range - 1);
      const end = Math.min(state.leaderboardData.users.length, rank + range);
      return state.leaderboardData.users.slice(start, end);
    },

    getUserRankChange: (userId: string) => {
      const user = get().getUserById(userId);
      if (!user) return 0;
      return user.previousRank - user.currentRank;
    },

    getUserPercentile: (userId: string) => {
      const state = get();
      const user = state.leaderboardData.users.find((u) => u.userId._id === userId);
      if (!user) return 0;
      const userIndex = state.leaderboardData.users.indexOf(user);
      return (userIndex / state.leaderboardData.users.length) * 100;
    },

    isUserInTopTen: (userId: string) => {
      const state = get();
      const user = state.leaderboardData.users.find((u) => u.userId._id === userId);
      return user ? user.currentRank <= 10 : false;
    },

    isDataStale: () => {
      const state = get();
      if (!state.leaderboardData.lastFetched) return true;
      const fiveMinutes = 5 * 60 * 1000;
      return Date.now() - state.leaderboardData.lastFetched.getTime() > fiveMinutes;
    },

    searchResults: () => {
      const state = get();
      if (!state.filters.searchQuery) return [];
      const query = state.filters.searchQuery.toLowerCase();
      return state.leaderboardData.users.filter((u) => u.username.toLowerCase().includes(query));
    },
  })
);

export default useLeaderboardStore;