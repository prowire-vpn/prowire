import {useCallback} from 'react';
import {Linking} from 'react-native';
import {useAuthDispatch} from 'auth/state';
import {generatePkceFlowStartData} from 'auth/utils';
import {useConfig} from 'config/state';

export function useStartAuth() {
  const {apiUrl} = useConfig();
  const dispatch = useAuthDispatch();

  return useCallback(
    (provider: string, forceRefresh?: boolean) => {
      const {state, codeChallenge, codeVerifier} = generatePkceFlowStartData();

      const url = new URL(`${apiUrl}/auth/${provider}`);
      if (forceRefresh) {
        url.pathname += '/force-refresh';
      }
      url.searchParams.append('state', state);
      url.searchParams.append('code_challenge', codeChallenge);
      url.searchParams.append('redirect_uri', 'prowire://auth/redirect');

      dispatch({
        type: 'startFlow',
        payload: {state, codeVerifier},
      });

      Linking.openURL(url.toString());
    },
    [apiUrl, dispatch],
  );
}
