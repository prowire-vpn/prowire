import * as React from 'react';
import {useCallback} from 'react';
import {Root, Content} from './ConnectButton.style';
import PowerIcon from 'assets/icons/power.svg';
import {Typography} from 'ui/components';
import {useServerConnect} from 'vpn/data';
import {useVpn} from 'vpn/state';

export function ConnectButton() {
  const {publicKey} = useVpn();
  const {mutate} = useServerConnect(publicKey ?? '', {
    onSuccess: data => {
      console.log('ConnectButton.onSuccess', data);
    },
  });

  const onPress = useCallback(() => {
    console.log('ConnectButton.onPress');

    mutate();
  }, [mutate]);

  return (
    <Root onPress={onPress}>
      <Content>
        <PowerIcon />
        <Typography>Start</Typography>
      </Content>
    </Root>
  );
}
