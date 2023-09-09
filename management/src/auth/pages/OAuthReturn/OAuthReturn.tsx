import * as React from 'react';
import {Suspense, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {TokenExchanger} from 'auth/components';
import {useGetState, clearState} from 'auth/data';
import {useAuthenticated} from 'auth/hooks';
import {useAuthDispatch} from 'auth/state';
import {FullPageLoader} from 'base/components/FullPageLoader';

/** Handle OAuth2 return */
export function OAuthReturn() {
  useAuthenticated({requireAuthentication: false});
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();
  const {data: savedState, isSuccess} = useGetState();

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
    const url = new URL(window.location.href);

    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code) {
      dispatch({
        type: 'error',
        payload: new Error('No code in redirect'),
      });
      navigate('/auth');
      return;
    }
    if (!state) {
      dispatch({
        type: 'error',
        payload: new Error('No state in redirect'),
      });
      navigate('/auth');
      return;
    }
    if (savedState !== state) {
      dispatch({
        type: 'error',
        payload: new Error('State does not match'),
      });
      navigate('/auth');
      return;
    }
    clearState();
    dispatch({type: 'setCode', payload: code});
  }, [dispatch, navigate, savedState]);

  return (
    <Suspense fallback={<FullPageLoader />}>
      <TokenExchanger />
    </Suspense>
  );
}
