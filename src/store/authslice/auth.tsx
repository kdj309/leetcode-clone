import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface authSlice {
  isLogedIn: boolean;
  signOut: () => void;
  signIn: () => void;
}

export const useAuthSlice = create<authSlice>()(
  persist(
    (set) => ({
      isLogedIn: false,
      signOut: () => set(() => ({ isLogedIn: false })),
      signIn: () => set(() => ({ isLogedIn: true })),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ isLogedIn: state.isLogedIn }), // Only persist isLogedIn
    }
  )
);
