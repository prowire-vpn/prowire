import {Base} from 'app/domain';

export type IdentityConstructor = Pick<Identity, 'provider' | 'accessToken' | 'refreshToken'> & {
  id?: string;
};

export type IdentityProvider = 'google';

export type IdentityUpdater = Pick<Partial<Identity>, 'accessToken' | 'refreshToken'>;

export class Identity extends Base {
  public provider: IdentityProvider;
  public accessToken: string;
  public refreshToken?: string;

  public constructor(init: IdentityConstructor) {
    super(init);
    this.provider = init.provider;
    this.accessToken = init.accessToken;
    this.refreshToken = init.refreshToken;
    this.initialized = true;
  }

  public update(update: IdentityUpdater): Identity {
    this.accessToken = update.accessToken ?? this.accessToken;
    this.refreshToken = update.refreshToken ?? this.refreshToken;
    return this;
  }
}
