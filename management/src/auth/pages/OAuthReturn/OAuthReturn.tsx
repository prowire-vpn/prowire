import {Flex, Stack, Text, Spinner} from '@chakra-ui/react';
import * as React from 'react';
import {useEffect, useContext} from 'react';
import {useAuthenticated} from 'auth/hooks';
import {AuthContext} from 'auth/init';
import {OAuthStateService} from 'auth/services';
import {FullPageLoader} from 'base/components';
import {ConfigContext} from 'base/context';

/** Handle OAuth2 return */
export function OAuthReturn() {
  useAuthenticated({requireAuthentication: false});
  const {setAccessToken} = useContext(AuthContext);
  const {clientConfig} = useContext(ConfigContext);

  useEffect(() => {
    const url = new URL(window.location.href);

    // Check that the state is valid
    const state = url.searchParams.get('state');
    if (!OAuthStateService.check(state)) throw new Error('TODO: error wrong state');

    // Check that the tokens have been passed properly
    const accessToken = url.searchParams.get('accessToken');

    if (!accessToken) {
      throw new Error('TODO: error no access token');
    }

    setAccessToken(accessToken);
  }, [clientConfig, setAccessToken]);

  return <FullPageLoader />;
}
