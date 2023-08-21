import * as React from 'react';
import {PropsWithChildren} from 'react';
import {Root, Separator, Text} from './TextSeparator.style';

export function TextSeparator({children}: PropsWithChildren) {
  return (
    <Root>
      <Separator />
      <Text variant="body" color="secondary">
        {children}
      </Text>
      <Separator />
    </Root>
  );
}
