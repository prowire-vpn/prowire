import Color from 'color';
import * as React from 'react';
import {useCallback} from 'react';
import {Dimensions} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Root, Button} from './ConnectButton.style';
import PowerIcon from 'assets/icons/power.svg';
import {Typography} from 'ui/components';
import {useServerConnect, useStartVpn, useStopVpn} from 'vpn/data';
import {useVpn} from 'vpn/state';

export function ConnectButton() {
  const {
    publicKey,
    privateKey,

    state,
  } = useVpn();

  const {mutate: startVpn} = useStartVpn();

  const {mutate: stopVpn} = useStopVpn();

  const {mutate: fetchConfig} = useServerConnect(publicKey ?? '', {
    onSuccess: (data) => {
      if (!publicKey || !privateKey) {
        throw new Error('No keys');
      }
      startVpn({...data, publicKey, privateKey});
    },
  });

  const onPress = useCallback(() => {
    if (state === 'disconnected') {
      fetchConfig();
      return;
    }
    stopVpn();
  }, [fetchConfig, stopVpn, state]);

  let buttonText = 'Start';
  if (state !== 'disconnected') {
    buttonText = 'Stop';
  }

  const theme = useTheme();

  return (
    <Root
      colors={[
        Color(theme.colors.primary).lighten(0.5).string(),
        theme.colors.white,
        Color(theme.colors.primary).lighten(0.5).string(),
      ]}
    >
      <Button
        onPress={onPress}
        android_ripple={{
          color: Color(theme.colors.primary).lighten(0.5).string(),
          borderless: true,
          radius: Math.round(Dimensions.get('window').width / 4),
        }}
      >
        <PowerIcon />
        <Typography>{buttonText}</Typography>
      </Button>
    </Root>
  );
}
