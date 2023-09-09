import * as React from 'react';
import {IdentityProviderButton} from './IdentityProviderButton';
import {IdentityProvider} from 'auth/const';
import {render} from 'test/utils';

describe('IdentityProviderButton', () => {
  it('should display given text', () => {
    const provider = IdentityProvider.Google;

    render(<IdentityProviderButton provider={provider} />);
  });
});
