import {IdentityProvider} from 'auth/models';

/** Props definition for the IdentityProviderButton component */
export interface IdentityProviderButtonProps {
  /** Identity provider to which the button will lead*/
  provider: IdentityProvider;
}
