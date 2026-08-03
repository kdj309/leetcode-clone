import { createContext, FC, useContext, useEffect } from 'react';
import { authCtx, contextWrapperProps } from '../utils/types';
import { useAuthSlice } from '../store/authslice/auth';
import { useUserSlice } from '../store/user';
import signOut from '../services/signOut';

export const AuthContext = createContext<authCtx>({ isLoading: false, isError: false, error: null });

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  return ctx;
};

export const AuthContextWrapper: FC<contextWrapperProps> = ({ children }) => {
  const signIn = useAuthSlice((state) => state.signIn);
  const checkSession = useUserSlice((state) => state.checkSession);
  const sessionLoading = useUserSlice((state) => state.sessionLoading);
  const user = useUserSlice((state) => state.user);

  const currentPath = window.location.pathname;
  const isProtectedRoute = currentPath !== '/' && !['/signin', '/signup'].includes(currentPath);

  useEffect(() => {
    if (sessionLoading === 'Completed') {
      if (!user) {
        if (isProtectedRoute) {
          signOut();
          window.location.href = '/signin';
        }
      } else {
        signIn();
      }
    }
  }, [sessionLoading, user, signIn, isProtectedRoute]);

  useEffect(() => {
    if (!['/signin', '/signup'].includes(window.location.pathname)) {
      checkSession();
    }
  }, [checkSession]);

  return (
    <AuthContext.Provider value={{ isLoading: false, isError: false, error: null }}>{children}</AuthContext.Provider>
  );
};
