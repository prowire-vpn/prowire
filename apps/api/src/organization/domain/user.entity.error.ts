import {type IdentityProvider} from './identity.entity';
import {User} from './user.entity';

export class IdentityExistsError extends Error {
  constructor(user: User, provider: IdentityProvider) {
    super(
      `Can not create identity with provider "${provider}" for user "${user.id}" as it already exists`,
    );
  }
}
