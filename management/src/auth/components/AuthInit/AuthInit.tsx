import type {PropsWithChildren} from 'react';
import * as React from 'react';
import {usePopulateRefreshTokenFromStorage, useAttemptToRefreshToken} from './hooks';

export function AuthInit({children}: PropsWithChildren) {
  usePopulateRefreshTokenFromStorage();
  useAttemptToRefreshToken();

  return <>{children}</>;
}
