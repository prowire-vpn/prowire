import * as React from 'react';
import {useCallback} from 'react';
import {Root, Content} from './ConnectButton.style';
import PowerIcon from 'assets/icons/power.svg';
import {Typography} from 'ui/components';

export function ConnectButton() {
  const onPress = useCallback(() => {
    console.log('ConnectButton.onPress');
  }, []);

  return (
    <Root onPress={onPress}>
      <Content>
        <PowerIcon />
        <Typography>Start</Typography>
      </Content>
    </Root>
  );
}
