import {fromUnixTime, differenceInMilliseconds} from 'date-fns';
import jwtDecode from 'jwt-decode';
import {useEffect, useState} from 'react';
import * as React from 'react';
import {InitAuthProps, IAuthContext} from './InitAuth.types';
import {usePostRefreshToken} from 'auth/api';
import {setAccessToken as setApiAccessToken} from 'base/api';
import {FullPageLoader} from 'base/components';

export const AuthContext = React.createContext<IAuthContext>({
  accessToken: undefined,
  setAccessToken: () => {
    throw new Error('Not implemented');
  },
});

/**
 * Init component of the auth module
 * It makes sure that we attempt to refresh using our server cookies
 */
export function InitAuth({children}: InitAuthProps) {
  const [accessToken, setAccessToken] = useState<undefined | string>(undefined);

  const {data, mutate: refreshToken, error} = usePostRefreshToken({retry: false});

  useEffect(() => {
    if (!data && !error) {
      refreshToken();
    }
  }, [data, error, refreshToken]);

  useEffect(() => {
    if (data?.accessToken && data.accessToken !== accessToken) {
      setApiAccessToken(data.accessToken);
      setAccessToken(data.accessToken);
      // Automatically re-fetch token before it expires
      const {iat, exp} = jwtDecode<{iat?: number; exp?: number}>(data.accessToken);
      if (!iat || !exp) return;
      const expiresAt = fromUnixTime(exp);
      const timeout = setTimeout(() => {
        refreshToken();
      }, differenceInMilliseconds(expiresAt, new Date()));

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [data, accessToken, setAccessToken, refreshToken]);

  return (
    <AuthContext.Provider value={{accessToken, setAccessToken}}>
      {accessToken || error ? children : <FullPageLoader />}
    </AuthContext.Provider>
  );
}
