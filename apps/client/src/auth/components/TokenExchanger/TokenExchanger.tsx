import * as React from 'react';
import {PropsWithChildren} from 'react';
import {usePostToken, useStoreRefreshToken} from 'auth/data';
import {useAuthDispatch, useAuth} from 'auth/state';
import {setAccessToken} from 'base/data';

export function TokenExchanger({children}: PropsWithChildren) {
  const {code, codeVerifier, refreshToken} = useAuth();
  const dispatch = useAuthDispatch();

  const {mutate: storeRefreshToken} = useStoreRefreshToken();

  usePostToken(
    {
      code: code ?? '',
      code_verifier: codeVerifier ?? '',
    },
    {
      refetchInterval: false,
      cacheTime: 0,
      suspense: true,
      enabled: !refreshToken && !!code && !!codeVerifier,
      onSuccess: data => {
        if (!data.refresh_token) {
          throw new Error('No refresh token provided by API');
        }

        storeRefreshToken(data.refresh_token);
        setAccessToken(data.access_token);
        dispatch({
          type: 'finishFlow',
          payload: {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          },
        });
      },
      onError: err => {
        dispatch({type: 'error', payload: err});
      },
    },
  );

  return <>{children}</>;
}
