import * as React from 'react';
import {IdentityProviderButton} from './IdentityProviderButton';
import {IdentityProvider} from 'auth/models';
import {render} from 'test/utils';

describe('IdentityProviderButton', () => {
  it('should display given text', () => {
    const provider = IdentityProvider.getProviderByName('google');

    render(<IdentityProviderButton provider={provider} />);
  });
});
