import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { problemsubmission, user } from '../../utils/types';
import validateSession from '../../services/validateSession';

interface userSlice {
  user: user | null;
  setUser: (user: user | null) => void;
  checkSession: () => Promise<void>;
  appendSubmissions: (userId: string, submissions: problemsubmission[]) => void; 
  sessionLoading: string;
}
export const useUserSlice = create<userSlice>()(
  devtools(
    (set) => ({
      user: null,
      setUser: (user) => set(() => ({ user: user }), false, 'setUser'),
      sessionLoading: 'Not Started',
      appendSubmissions: (userId: string, submissions: problemsubmission[]) =>
        set(
          (state) => {
            if (!state.user || state.user._id !== userId) return {};
            return {
              user: {
                ...state.user,
                submissions: [...(state.user.submissions ?? []), ...submissions],
              },
            };
          },
          false,
          'appendSubmissions'
        ),
      checkSession: async () => {
        try {
          set({ sessionLoading: 'Loading' }, false, 'checkSession/loading');
          const response = await validateSession();
          set({ user: response?.data.user, sessionLoading: 'Completed' }, false, 'checkSession/success');
        } catch (error) {
          set({ user: null, sessionLoading: 'Completed' }, false, 'checkSession/error');
        }
      },
    }),
    { name: 'userSlice' }
  )
);
