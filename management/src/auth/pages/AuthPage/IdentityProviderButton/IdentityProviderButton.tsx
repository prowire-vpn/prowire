import {Button} from '@chakra-ui/react';
import * as React from 'react';
import {useCallback, useContext, useState} from 'react';
import {FcGoogle} from 'react-icons/fc';
import {IdentityProviderButtonProps} from './IdentityProviderButton.types';
import {OAuthStateService} from 'auth/services';
import {ConfigContext} from 'base/context';

/** Button used to initiate an identity provider authentication flow*/
export function IdentityProviderButton({provider}: IdentityProviderButtonProps) {
  const [clicked, isClicked] = useState(false);
  const {clientConfig} = useContext(ConfigContext);
  // On button click trigger the action to start identity provider flow
  const onClick = useCallback(() => {
    if (!clientConfig) throw new Error('Client config not defined');
    isClicked(true);
    // Generate state
    const state = OAuthStateService.create();
    window.location.href = `${clientConfig.API_URL}/auth/${provider}?state=${state}`;
  }, [provider, clientConfig]);

  return (
    <Button leftIcon={<FcGoogle />} disabled={clicked} isLoading={clicked} onClick={onClick}>
      Continue with {provider}
    </Button>
  );
}
