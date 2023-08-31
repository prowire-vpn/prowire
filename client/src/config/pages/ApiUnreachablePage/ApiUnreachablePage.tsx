import * as React from 'react';
import {Root} from './ApiUnreachablePage.style';
import {ChangeServerButton} from 'config/components';
import {Typography} from 'ui/components';

export function ServerUnreachablePage() {
  return (
    <Root>
      <Typography>Unable to reach the Prowire Server</Typography>
      <ChangeServerButton />
    </Root>
  );
}
