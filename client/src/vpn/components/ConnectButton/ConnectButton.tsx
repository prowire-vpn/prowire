import * as React from 'react';
import {useCallback, useEffect} from 'react';
import {Root} from './ConnectButton.style';
import PowerIcon from 'assets/icons/power.svg';
import {Typography} from 'ui/components';
import {useServerConnect, useStartVpn, useStopVpn} from 'vpn/data';
import {useVpn, useVpnDispatch} from 'vpn/state';

export function ConnectButton() {
  const {
    publicKey,
    privateKey,
    ca,
    certificate,
    mode,
    protocol,
    servers,
    state,
  } = useVpn();
  const dispatch = useVpnDispatch();

  const {mutate: fetchConfig} = useServerConnect(publicKey ?? '', {
    onSuccess: data => {
      dispatch({type: 'start', payload: data});
    },
  });

  const {mutate: startVpn} = useStartVpn({
    onSuccess: () => {
      console.log('Connected');
    },
  });

  const {mutate: stopVpn} = useStopVpn({
    onSuccess: () => {
      console.log('Disconnected');
    },
  });

  const onPress = useCallback(() => {
    if (state === 'disconnected') {
      fetchConfig();
      return;
    }
    stopVpn();
  }, [fetchConfig, stopVpn, state]);

  useEffect(() => {
    if (
      !!publicKey &&
      !!privateKey &&
      !!ca &&
      !!certificate &&
      !!mode &&
      !!protocol &&
      servers.length > 0
    ) {
      startVpn({
        privateKey,
        publicKey,
        ca,
        certificate,
        mode,
        protocol,
        servers,
      });
    }
  }, [
    startVpn,
    publicKey,
    privateKey,
    ca,
    certificate,
    mode,
    protocol,
    servers,
  ]);

  let buttonText = 'Start';
  if (state === 'connected') {
    buttonText = 'Stop';
  }
  if (state === 'connecting') {
    buttonText = 'Connecting...';
  }
  if (state === 'disconnecting') {
    buttonText = 'Disconnecting...';
  }

  return (
    <Root onPress={onPress}>
      <PowerIcon />
      <Typography>{buttonText}</Typography>
    </Root>
  );
}
