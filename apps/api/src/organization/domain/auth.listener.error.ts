import {type IdentityProvider} from './identity.entity';
import {User} from './user.entity';

export class MissingIdentityCreationDataError extends Error {
  constructor(user: User, provider: IdentityProvider) {
    super(
      `Missing some data requires to create identity with provider "${provider}" for user "${user.id}"`,
    );
  }
}
