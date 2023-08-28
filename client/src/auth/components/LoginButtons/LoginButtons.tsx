import {FC, useCallback} from 'react';
import * as React from 'react';
import {Linking} from 'react-native';
import {SvgProps} from 'react-native-svg';
import GoogleLogo from 'assets/icons/google.svg';
import {useAuthDispatch} from 'auth/state';
import {generatePkceFlowStartData} from 'auth/utils';
import {useConfig} from 'config/state';
import {Button} from 'ui/components';

interface AuthProvider {
  key: string;
  name: string;
  logo: FC<SvgProps>;
}

const providers: Array<AuthProvider> = [
  {
    key: 'google',
    name: 'Google',
    logo: GoogleLogo,
  },
];

export function LoginButtons() {
  return (
    <>
      {providers.map(provider => (
        <LoginButton key={provider.key} provider={provider} />
      ))}
    </>
  );
}

function LoginButton({provider}: {provider: AuthProvider}) {
  const {apiUrl} = useConfig();
  const dispatch = useAuthDispatch();

  const startFlow = useCallback(() => {
    const {state, codeChallenge, codeVerifier} = generatePkceFlowStartData();

    const url = new URL(`${apiUrl}/auth/${provider.key}`);
    url.searchParams.append('state', state);
    url.searchParams.append('code_challenge', codeChallenge);
    url.searchParams.append('redirect_uri', 'prowire://auth/redirect');

    dispatch({
      type: 'startFlow',
      payload: {state, codeVerifier},
    });

    Linking.openURL(url.toString());
  }, [apiUrl, dispatch, provider.key]);

  return (
    <Button
      color="white"
      text={provider.name}
      prefixIcon={provider.logo}
      onPress={startFlow}
    />
  );
}
