import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface authSlice {
  isLogedIn: boolean;
  signOut: () => void;
  signIn: () => void;
}

export const useAuthSlice = create<authSlice>()(
  devtools(
    persist(
      (set) => ({
        isLogedIn: false,
        signOut: () => set(() => ({ isLogedIn: false }), false, 'signOut'),
        signIn: () => set(() => ({ isLogedIn: true }), false, 'signIn'),
      }),
      {
        name: 'auth-storage', // localStorage key
        partialize: (state) => ({ isLogedIn: state.isLogedIn }), // Only persist isLogedIn
      }
    ),
    { name: 'authSlice' }
  )
);
