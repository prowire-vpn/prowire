import {useEffect, PropsWithChildren} from 'react';
import * as React from 'react';
import {Platform, Linking} from 'react-native';
import {useStartAuth} from 'auth/hooks';
import {useAuth, useAuthDispatch} from 'auth/state';

export function RedirectHandler({children}: PropsWithChildren) {
  const {state: savedSate} = useAuth();
  const dispatch = useAuthDispatch();
  const startAuth = useStartAuth();

  useEffect(() => {
    function handleRedirectUrl(urlStr: string) {
      const url = new URL(urlStr);
      const realPath = (url.hostname + url.pathname).replace(/(^\/*)|(\/*$)/, '');

      if (realPath !== 'auth/redirect') {
        return;
      }
      const error = url.searchParams.get('error');
      const provider = url.searchParams.get('provider');

      if (provider && error === 'no-refresh-token-provided') {
        startAuth(provider, true);
        return;
      }

      if (error) {
        dispatch({
          type: 'error',
          payload: new Error(`Could not authenticate: ${error}`),
        });
        return;
      }

      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      if (!code) {
        dispatch({
          type: 'error',
          payload: new Error('No code in redirect'),
        });
        return;
      }
      if (!state) {
        dispatch({
          type: 'error',
          payload: new Error('No state in redirect'),
        });
        return;
      }
      if (savedSate !== state) {
        dispatch({
          type: 'error',
          payload: new Error('State does not match'),
        });
        return;
      }

      dispatch({type: 'setCode', payload: code});
    }

    if (Platform.OS === 'web') {
      window.electron.ipcRenderer.on('auth-redirect', (url: unknown) => {
        if (typeof url !== 'string') {
          throw new Error('URL is not a string');
        }
        handleRedirectUrl(url);
      });
      return () => window.electron.ipcRenderer.removeAllListeners('auth-redirect');
    } else {
      const subscription = Linking.addEventListener('url', (event) => {
        handleRedirectUrl(event.url);
      });
      return () => subscription.remove();
    }
  }, [dispatch, savedSate, startAuth]);

  return <>{children}</>;
}
