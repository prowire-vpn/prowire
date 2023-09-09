import {PropsWithChildren} from 'react';
import * as React from 'react';
import {
  usePopulateRefreshTokenFromStorage,
  useAttemptToRefreshToken,
} from './hooks';
import {LoginPage} from 'auth/pages';
import {useAuth} from 'auth/state';

export function AuthInit({children}: PropsWithChildren) {
  const {accessToken} = useAuth();

  usePopulateRefreshTokenFromStorage();
  useAttemptToRefreshToken();

  if (accessToken) {
    return <>{children}</>;
  }
  return <LoginPage />;
}
