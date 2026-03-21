import { ComponentType, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useUserSlice } from '../store/user';
import { useAuthSlice } from '../store/authslice/auth';

/**
 * Higher-Order Component (HOC) for protecting routes
 * 
 * Checks if user is authenticated before rendering component
 * Redirects to login page if user is not logged in
 * Shows loading state during session validation
 */
export function withProtected<P extends object>(
  Component: ComponentType<P>,
  fallbackRoute = '/signin'
): (props: P) => ReactNode {
  return (props: P) => {
    const user = useUserSlice((state) => state.user);
    const sessionLoading = useUserSlice((state) => state.sessionLoading);
    const isLoggedIn = useAuthSlice((state) => state.isLogedIn);

    if (sessionLoading==='Loading') {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: 'background.default',
          }}
        >
          <CircularProgress
            size={60}
            sx={{
              color: 'primary.main',
            }}
          />
        </Box>
      );
    }

    const isAuthenticated = isLoggedIn && user?._id;

    if (!isAuthenticated) {
      return <Navigate to={fallbackRoute} replace />;
    }

    return <Component {...props} />;
  };
}

