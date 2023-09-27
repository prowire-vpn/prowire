import Color from 'color';
import {differenceInSeconds} from 'date-fns';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useTheme} from 'styled-components/native';
import {Root, Status, Timer} from './StatusHeader.style';
import {useVpn} from 'vpn/state';

export function StatusHeader() {
  const theme = useTheme();
  const {state, connectedAt} = useVpn();
  const [timer, setTimer] = useState('00:00:00');

  let text = 'Not connected !';
  if (state === 'connected') {
    text = 'Connected';
  }
  if (state === 'connecting') {
    text = 'Connecting...';
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!connectedAt) {
        setTimer('00:00:00');
        return;
      }
      const totalSeconds = differenceInSeconds(new Date(), connectedAt);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
      const seconds = totalSeconds - hours * 3600 - minutes * 60;
      const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
      const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
      setTimer(`${hoursStr}:${minutesStr}:${secondsStr}`);
    }, 250);
    return () => clearInterval(interval);
  }, [connectedAt]);

  return (
    <Root
      colors={['transparent', Color(theme.colors.primary).alpha(0.5).hsl().string(), 'transparent']}
      start={{x: 0, y: 0.5}}
      end={{x: 1, y: 0.5}}
    >
      <Status variant="header">{text}</Status>
      <Timer variant="header" color="secondary">
        {timer}
      </Timer>
    </Root>
  );
}
