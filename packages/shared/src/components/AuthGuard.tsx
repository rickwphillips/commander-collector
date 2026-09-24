'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  clearToken,
  consumeUrlToken,
  getValidToken,
  redirectToLogin,
  type AuthUser,
} from '../lib/auth';
import { useAuthUser } from '../lib/useAuthUser';

interface AuthContextType {
  user: AuthUser | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

/** Routes that render without signing in (the phone remote joins by code). */
const PUBLIC_PATHS = ['/game-manager/remote'];

/**
 * Renders its children only for a signed-in user, except on public routes.
 * Children do not mount until the token is stored, so their effects never call
 * the API before a token handed over in the URL has been saved.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.some((p) => pathname?.includes(p));
  const { user, known } = useAuthUser();

  const logout = () => {
    clearToken();
    redirectToLogin({ logout: true });
  };

  // Store a token handed over as ?token= (cross-origin dev flow). storeToken
  // notifies useAuthUser, which re-renders with the user.
  useEffect(() => {
    if (!isPublic) consumeUrlToken();
  }, [isPublic]);

  // Send signed-out visitors to login once the token can be read. Reads the
  // store directly: a URL token stored by the effect above is not yet in `user`.
  useEffect(() => {
    if (!isPublic && known && !getValidToken()) redirectToLogin();
  }, [isPublic, known, user]);

  if (isPublic) {
    return <AuthContext.Provider value={{ user: null, logout }}>{children}</AuthContext.Provider>;
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>;
}
