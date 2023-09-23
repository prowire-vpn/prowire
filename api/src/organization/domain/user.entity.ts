import {
  Identity,
  type IdentityProvider,
  type IdentityConstructor,
  type IdentityUpdater,
} from './identity.entity';
import {EmailAddress} from './email.entity';
import {IdentityExistsError} from './user.entity.error';
import {Base} from 'app/domain';

export type UserConstructor = Pick<User, 'name' | 'email'> &
  Partial<Pick<User, 'id' | 'avatar' | 'admin'>> & {
    identities?: Array<IdentityConstructor>;
  };

export type UserUpdater = Partial<Pick<User, 'name' | 'email' | 'avatar' | 'admin'>>;

export class User extends Base {
  public name: string;
  public email: EmailAddress;
  public avatar?: string;
  public admin: boolean;
  public identities: Array<Identity>;

  public constructor(init: UserConstructor) {
    super(init);
    this.name = init.name;
    this.email = init.email;
    this.avatar = init.avatar;
    this.admin = init.admin ?? false;
    this.identities = init.identities?.map((identity) => new Identity(identity)) ?? [];
    this.initialized = true;
  }

  public update(update: UserUpdater): User {
    this.name = update.name ?? this.name;
    this.email = update.email ?? this.email;
    this.avatar = update.avatar ?? this.avatar;
    this.admin = update.admin ?? this.admin;
    return this;
  }

  public hasIdentity(provider: IdentityProvider): boolean {
    return this.getIdentity(provider) !== undefined;
  }

  public getIdentity(provider: IdentityProvider): Identity | undefined {
    return this.identities.find(({provider: x}) => x === provider);
  }

  public updateIdentity(provider: IdentityProvider, update: IdentityUpdater): User | void {
    this.identities.forEach((identity, index) => {
      if (identity.provider === provider) {
        this.identities[index] = identity.update(update);
        return this;
      }
    });
  }

  public addIdentity(
    provider: IdentityProvider,
    data: Omit<IdentityConstructor, 'provider'>,
  ): Identity {
    if (this.hasIdentity(provider)) throw new IdentityExistsError(this, provider);
    const identity = new Identity({provider, ...data});
    this.identities.push(identity);
    return identity;
  }
}
