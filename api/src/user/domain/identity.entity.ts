export type IdentityConstructor = Pick<Identity, 'provider' | 'accessToken' | 'refreshToken'>;

export type IdentityProvider = 'google';

export type IdentityUpdater = Pick<Partial<Identity>, 'accessToken' | 'refreshToken'>;

export class Identity {
  public provider: IdentityProvider;
  public accessToken: string;
  public refreshToken?: string;

  public constructor(init: IdentityConstructor) {
    this.provider = init.provider;
    this.accessToken = init.accessToken;
    this.refreshToken = init.refreshToken;
  }

  public update(update: IdentityUpdater): Identity {
    this.accessToken = update.accessToken ?? this.accessToken;
    this.refreshToken = update.refreshToken ?? this.refreshToken;
    return this;
  }
}
