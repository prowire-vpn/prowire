export class IdentityProvider {
  public static readonly providers: Array<IdentityProvider> = [];
  protected static readonly providersByName: Record<string, IdentityProvider> = {};

  public constructor(public readonly name: string, public readonly displayName: string) {
    IdentityProvider.providersByName[name] = this;
    IdentityProvider.providers.push(this);
  }

  public static getProviderByName(name: string): IdentityProvider {
    return IdentityProvider.providersByName[name];
  }
}

new IdentityProvider('google', 'Google');
