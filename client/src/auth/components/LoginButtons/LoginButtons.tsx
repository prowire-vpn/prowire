import {FC} from 'react';
import * as React from 'react';
import {SvgProps} from 'react-native-svg';
import GoogleLogo from 'assets/icons/google.svg';
import {useStartAuth} from 'auth/hooks';
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
  const startAuth = useStartAuth();

  return (
    <Button
      color="white"
      text={provider.name}
      prefixIcon={provider.logo}
      onPress={() => startAuth(provider.key)}
    />
  );
}
