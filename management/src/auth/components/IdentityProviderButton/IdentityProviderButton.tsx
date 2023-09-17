import {Button} from '@chakra-ui/react';
import * as React from 'react';
import {useCallback, useState} from 'react';
import {FcGoogle} from 'react-icons/fc';
import {IdentityProviderButtonProps} from './IdentityProviderButton.types';
import {useStartAuth} from 'auth/hooks';

/** Button used to initiate an identity provider authentication flow*/
export function IdentityProviderButton({provider}: IdentityProviderButtonProps) {
  const [clicked, isClicked] = useState(false);

  const startAuth = useStartAuth();

  // On button click trigger the action to start identity provider flow
  const onClick = useCallback(() => {
    isClicked(true);
    startAuth(provider);
  }, [provider, startAuth]);

  return (
    <Button leftIcon={<FcGoogle />} disabled={clicked} isLoading={clicked} onClick={onClick}>
      Continue with {provider.displayName}
    </Button>
  );
}
