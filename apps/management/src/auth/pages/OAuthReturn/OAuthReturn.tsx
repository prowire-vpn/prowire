import * as React from 'react';
import {Suspense, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {TokenExchanger} from 'auth/components';
import {useGetState, clearState} from 'auth/data';
import {useAuthenticated, useStartAuth} from 'auth/hooks';
import {IdentityProvider} from 'auth/models';
import {useAuthDispatch} from 'auth/state';
import {FullPageLoader} from 'base/components/FullPageLoader';

/** Handle OAuth2 return */
export function OAuthReturn() {
  useAuthenticated({requireAuthentication: false});
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();
  const {data: savedState, isSuccess} = useGetState();
  const startAuth = useStartAuth();

  useEffect(() => {
    if (isSuccess && !savedState) {
      dispatch({
        type: 'error',
        payload: new Error('No state was stored'),
      });
      navigate('/auth');
    }
  }, [isSuccess, savedState, dispatch, navigate]);

  useEffect(() => {
    if (!savedState) return;

    try {
      const url = new URL(window.location.href);
      const error = url.searchParams.get('error');
      const providerName = url.searchParams.get('provider');

      if (!providerName) throw new Error('No provider in redirect');

      const provider = IdentityProvider.getProviderByName(providerName);

      if (!provider) throw new Error(`Unknown identity provider: ${providerName}`);

      if (provider && error === 'no-refresh-token-provided') {
        startAuth(provider, true);
        return;
      }

      if (error) throw new Error(`Could not authenticate: ${error}`);

      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      if (!code) throw new Error('No code in redirect');
      if (!state) throw new Error('No state in redirect');
      if (savedState !== state) throw new Error('State does not match');
      clearState();
      dispatch({type: 'setCode', payload: code});
    } catch (error) {
      dispatch({
        type: 'error',
        payload: error,
      });
      navigate('/auth');
    }
  }, [dispatch, navigate, savedState, startAuth]);

  return (
    <Suspense fallback={<FullPageLoader />}>
      <TokenExchanger />
    </Suspense>
  );
}
