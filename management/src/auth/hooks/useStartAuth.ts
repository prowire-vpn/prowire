import {useCallback} from 'react';
import {storeState, storeCodeVerifier} from 'auth/data';
import {IdentityProvider} from 'auth/models';
import {generatePkceFlowStartData} from 'auth/utils';
import {useConfig} from 'base/state';

export function useStartAuth() {
  const {apiUrl, managementUrl} = useConfig();

  // On button click trigger the action to start identity provider flow
  return useCallback(
    (provider: IdentityProvider, forceRefresh?: boolean) => {
      if (!apiUrl) throw new Error('API URL is not defined');
      if (!managementUrl) throw new Error('MANAGEMENT URL is not defined');
      // Generate state
      const {state, codeChallenge, codeVerifier} = generatePkceFlowStartData();

      const url = new URL(`${apiUrl}/auth/${provider.name}`);
      url.pathname = url.pathname.replace(/\/+/g, '/');
      if (forceRefresh) {
        url.pathname += '/force-refresh';
      }
      url.searchParams.set('state', state);
      url.searchParams.set('code_challenge', codeChallenge);
      url.searchParams.set('redirect_uri', `${managementUrl}/auth/return`);

      storeState(state);
      storeCodeVerifier(codeVerifier);

      window.location.href = url.toString();
    },
    [apiUrl, managementUrl],
  );
}
