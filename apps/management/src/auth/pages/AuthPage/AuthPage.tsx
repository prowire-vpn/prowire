import {Heading, Flex, Stack, Image, Text} from '@chakra-ui/react';
import * as React from 'react';
import logo from '../../../../assets/logo_monochrome.svg';
import {IdentityProviderButton} from 'auth/components/IdentityProviderButton';
import {useAuthenticated} from 'auth/hooks';
import {IdentityProvider} from 'auth/models';
import {useAuth} from 'auth/state';

/** Main authentication page when the user is not authenticated */
export function AuthPage() {
  useAuthenticated({requireAuthentication: false});

  const {error} = useAuth();
  return (
    <Flex align="center" direction="column" height="100vh" justify="center">
      <Heading marginBottom={8}>Welcome to Prowire</Heading>
      {error ? (
        <Text marginBottom={8} color="red">
          Something went wrong, please try again
          {error instanceof Error ? (
            <>
              <br /> {error.message}
            </>
          ) : null}
        </Text>
      ) : null}
      <Stack direction="row" spacing="4">
        {IdentityProvider.providers.map((provider) => (
          <IdentityProviderButton provider={provider} key={provider.name} />
        ))}
      </Stack>
      <Image src={logo} alt="Prowire Logo" marginTop={8} width="50%" maxWidth={150} opacity={0.1} />
    </Flex>
  );
}
