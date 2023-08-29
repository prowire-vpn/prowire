import {Button} from '@chakra-ui/react';
import * as React from 'react';
import {useCallback, useState} from 'react';
import {FcGoogle} from 'react-icons/fc';
import {IdentityProviderButtonProps} from './IdentityProviderButton.types';
import {storeState, storeCodeVerifier} from 'auth/data';
import {generatePkceFlowStartData} from 'auth/utils';
import {useConfig} from 'base/state';

/** Button used to initiate an identity provider authentication flow*/
export function IdentityProviderButton({provider}: IdentityProviderButtonProps) {
  const [clicked, isClicked] = useState(false);
  const {apiUrl, managementUrl} = useConfig();

  // On button click trigger the action to start identity provider flow
  const onClick = useCallback(() => {
    if (!apiUrl) throw new Error('API URL is not defined');
    if (!managementUrl) throw new Error('MANAGEMENT URL is not defined');
    isClicked(true);
    // Generate state
    const {state, codeChallenge, codeVerifier} = generatePkceFlowStartData();

    const url = new URL(apiUrl);
    url.pathname = `${url.pathname}/auth/${provider}`.replace(/\/+/g, '/');
    url.searchParams.set('state', state);
    url.searchParams.set('code_challenge', codeChallenge);
    url.searchParams.set('redirect_uri', `${managementUrl}/auth/return`);

    storeState(state);
    storeCodeVerifier(codeVerifier);

    window.location.href = url.toString();
  }, [apiUrl, managementUrl, provider]);

  return (
    <Button leftIcon={<FcGoogle />} disabled={clicked} isLoading={clicked} onClick={onClick}>
      Continue with {provider}
    </Button>
  );
}
