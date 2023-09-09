import * as React from 'react';
import {Root, Logo} from './LoginPage.style';
import {RedirectHandler, LoginButtons, TokenExchanger} from 'auth/components';
import {useAuth} from 'auth/state';
import {ChangeServerButton} from 'config/components';
import {Typography} from 'ui/components';

export function LoginPage() {
  const {error} = useAuth();

  return (
    <RedirectHandler>
      <TokenExchanger>
        <Root>
          <Typography variant="header">Welcome to Prowire</Typography>
          <Typography variant="body" color="secondary">
            Select an authentication method
          </Typography>
          {error ? (
            <Typography variant="body" color="error">
              Something went wrong, please try again
            </Typography>
          ) : null}
          <LoginButtons />
          <ChangeServerButton />
          <Logo />
        </Root>
      </TokenExchanger>
    </RedirectHandler>
  );
}
