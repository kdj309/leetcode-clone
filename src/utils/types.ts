import { ReactNode } from 'react';

export interface themeContext {
  toggleColorMode: () => void;
  colorMode: 'light' | 'dark';
}
export interface authCtx {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}
export interface contextWrapperProps {
  children: ReactNode;
}
export interface Problem {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sampleInput: string;
  sampleOutput: string;
  testCases: { input: string; output: string }[];
  status: string;
  _id: string;
  starterCode: { lang_id: number; code: string }[];
  systemCode: { lang_id: number; code: string }[];
  imports: { lang_id: number; code: string }[];
  metadata: metadata;
  languagestoskip: number[];
}
export interface commonresponse {
  status: 'Success' | 'Failure';
  error?: string;
  data: any;
}
export interface getProblemsType extends Omit<commonresponse, 'data'> {
  data: Problem[];
}
export interface getProblemType extends Omit<commonresponse, 'data'> {
  data: Problem;
}

export interface getUserType extends Omit<commonresponse, 'data'> {
  data: user;
}
export interface signInType extends Omit<commonresponse, 'data'> {
  data: { id: string; sessionId: string };
}
export interface signUpType extends Omit<commonresponse, 'data'> {
  data: { id: string };
}

export interface updateUserType extends Omit<commonresponse, 'data'> {
  data: user;
}
export interface refreshTokenRes extends Omit<commonresponse, 'data'> {
  data: null;
}
export interface validateSessionRes extends Omit<commonresponse, 'data'> {
  data: { user: user | null; isExipred: boolean };
}

export interface batchSubmissionResponse extends Omit<commonresponse, 'data'> {
  data: {
    submissionIds: string[];
    _id:string
  };
}

export interface metadata {
  input_format: string;
  output_format: string;
  judge_input_template: string;
  variables_names: Record<string, string>;
  variables_types: Record<string, string>;
}
export interface inputformat extends Omit<metadata, 'judge_input_temple' | 'output_format'> {}
export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  wrapperClassName?: string;
  innerDivClassName?: string;
}
export interface submission {
  language_id: number;
  stdin: string;
  stdout: null | string;
  stderr: null | string;
  status: {
    id: number;
    description: string;
  };
  expected_output: string;
}
export interface problemsubmission {
  problemId: string;
  submissionId: string;
  languageId: number;
  status: 'Accepted' | 'Wrong Answer' | 'Error';
  submittedAt: Date;
}
export interface user {
  _id: string;
  username: string;
  email: string;
  password: string;
  favoriteProgrammingLanguage: number;
  roles: string[];
  submissions: problemsubmission[];
}
export interface createUser extends Partial<user> {}
export interface IupdateSubmission {
  submissionId: string;
  status: string;
  actual_output?: string[];
  memoryUsed?: number[];
  executionTime?: number[];
  problemId:string;
  languageId: number;
  submittedAt?:Date;
  difficulty?:string;
}
export type status = 'Accepted' | 'Wrong Answer' | 'Processing';
export interface submissionprops {
  problemId: string;
  submissionId: string;
  languageId: number;
  status: string;
  submittedAt: Date;
}
export interface batchsubmission {
  token: string;
}
export interface problemsubmissionstatus {
  problemId: string;
  submissionId: string;
  languageId: number;
  status: string;
  submittedAt: Date;
}
export enum ShrinkActionKind {
  SHRINKLEFTPANEL = 'SHRINKLEFTPANEL',
  SHRINKRIGHTPANEL = 'SHRINKRIGHTPANEL',
  EXPANDLEFTPANEL = 'EXPANDLEFTPANEL',
  EXPANDRIGHTPANEL = 'EXPANDRIGHTPANEL',
}

// An interface for our actions
export interface ShrinkAction {
  type: ShrinkActionKind;
}

// An interface for our state
export interface ShrinkState {
  shrinkrightpanel: boolean;
  shrinkleftpanel: boolean;
}

export interface SavedProblems extends Pick<Problem, '_id' | 'title' | 'difficulty'> {}

// Leaderboard Types
export interface LeaderboardUser {
  _id: string;
  userId: {
    _id:string,
    username:string
  };
  username: string;
  totalPoints: number;
  easyProblems: number;
  mediumProblems: number;
  hardProblems: number;
  totalSolved: number;
  currentRank: number;
  previousRank: number;
  isOnline: boolean;
  lastUpdated: Date;
}

export interface LeaderboardPagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type TimePeriod = 'all' | 'week' | 'month' | 'today';
export type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';
export type ViewMode = 'table' | 'cards';
export type SortBy = 'rank' | 'points' | 'recent';
export type SortOrder = 'asc' | 'desc';

export interface LeaderboardFilters {
  timePeriod: TimePeriod;
  searchQuery: string;
  difficultyFilter: DifficultyFilter;
  showOnlineOnly: boolean;
}

export interface LeaderboardUI {
  viewMode: ViewMode;
  sortBy: SortBy;
  sortOrder: SortOrder;
  highlightedUserId: string | null;
  autoRefresh: boolean;
  refreshInterval: number;
}

export interface UpdateEvent {
  userId: string;
  type: 'rank_change' | 'points_update' | 'status_change';
  data: Record<string, any>;
  timestamp: Date;
}

export interface LeaderboardRealtimeState {
  isConnected: boolean;
  lastUpdate: Date | null;
  pendingUpdates: UpdateEvent[];
  notificationsEnabled: boolean;
}

export interface LeaderboardCache {
  pageCache: Map<number, LeaderboardUser[]>;
  lastCacheCleared: Date | null;
  cacheDuration: number;
}

export interface LeaderboardData {
  users: LeaderboardUser[];
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

export interface LeaderboardState {
  // Data
  leaderboardData: LeaderboardData;
  
  // Pagination
  pagination: LeaderboardPagination;
  
  // Filters
  filters: LeaderboardFilters;
  
  // Current user
  currentUserId: string | null;
  currentUserRank: number | null;
  
  // UI
  ui: LeaderboardUI;
  
  // Realtime
  realtime: LeaderboardRealtimeState;
  
  // Cache
  cache: LeaderboardCache;
}
