import * as React from 'react';
import {PropsWithChildren, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {usePostToken, storeRefreshToken, useGetCodeVerifier, clearCodeVerifier} from 'auth/data';
import {useAuthDispatch, useAuth} from 'auth/state';
import {setAccessToken} from 'base/data';

export function TokenExchanger({children}: PropsWithChildren) {
  const {code, refreshToken} = useAuth();
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();
  const {data: codeVerifier, isSuccess} = useGetCodeVerifier();

  useEffect(() => {
    if (isSuccess && !codeVerifier) {
      dispatch({
        type: 'error',
        payload: new Error('No code verifier was stored'),
      });
      navigate('/auth');
    }
  }, [isSuccess, codeVerifier, dispatch, navigate]);

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
      onSuccess: (data) => {
        if (!data.refresh_token) {
          throw new Error('No refresh token provided by API');
        }

        storeRefreshToken(data.refresh_token);
        setAccessToken(data.access_token);
        clearCodeVerifier();
        dispatch({
          type: 'finishFlow',
          payload: {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          },
        });
      },
      onError: (err) => {
        dispatch({type: 'error', payload: err});
        navigate('/auth');
      },
    },
  );

  return <>{children}</>;
}
