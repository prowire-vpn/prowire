import * as React from 'react';
import {Root, ProwireLogo, SelectConnectionText} from './ApiConfigPage.style';
import ScanIcon from 'assets/icons/scan.svg';

import {TextSeparator, ApiUrlInputForm, ApiUrlValidator} from 'config/components';
import {Button} from 'ui/components';

export function ApiConfigPage() {
  return (
    <ApiUrlValidator>
      <Root>
        <ProwireLogo />
        <SelectConnectionText variant="header" color="primary">
          Connect to server by QR or manually type address
        </SelectConnectionText>
        <Button
          color="white"
          text="Scan connection QR"
          onPress={() => console.log('Press')}
          prefixIcon={ScanIcon}
        />
        <TextSeparator>OR</TextSeparator>
        <ApiUrlInputForm />
      </Root>
    </ApiUrlValidator>
  );
}
