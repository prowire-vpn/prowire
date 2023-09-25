import * as React from 'react';
import {Root, Header, Content, Title, Logo} from './HomePage.style';
import {LogoutButton} from 'auth/components';
import {ConnectButton, StatusHeader} from 'vpn/components';

export function HomePage() {
  return (
    <Root>
      <Header>
        <LogoutButton />
        <Title align="center">Prowire VPN</Title>
      </Header>
      <Content>
        <StatusHeader />
        <ConnectButton />
      </Content>
      <Logo />
    </Root>
  );
}
