import {
  type IdentityProvider,
  EmailAddress,
  type IdentityUpdater,
  type RegisterUserInfo,
} from 'organization/domain';

export interface OAuthConstructor {
  email: string;
  name?: string;
  accessToken: string;
  refreshToken?: string;
  state?: string;
}

// Identity obtained from a third party provider
export abstract class ThirdPartyIdentity {
  provider: IdentityProvider;
  email: EmailAddress;
  accessToken: string;
  refreshToken?: string;
  name?: string;
  requiresRefreshToken = false;

  constructor(provider: IdentityProvider, profile: OAuthConstructor) {
    this.provider = provider;
    this.email = new EmailAddress(profile.email);
    this.accessToken = profile.accessToken;
    this.refreshToken = profile.refreshToken;
    this.name = profile.name;
  }

  public get hasRequiredRefreshToken(): boolean {
    if (this.requiresRefreshToken && !this.refreshToken) return false;
    return true;
  }

  public get hasDataForAccountCreation(): boolean {
    return this.hasRequiredRefreshToken && !!this.name;
  }

  public toIdentityData(): IdentityUpdater {
    return {accessToken: this.accessToken, refreshToken: this.refreshToken};
  }

  public toRegistrationData(): RegisterUserInfo {
    if (!this.name || !this.accessToken)
      throw new Error(
        "Missing data for registration, ensure you call 'hasDataForAccountCreation' first",
      );
    return {
      name: this.name,
      email: this.email,
      identities: [
        {provider: this.provider, accessToken: this.accessToken, refreshToken: this.refreshToken},
      ],
    };
  }
}

export class GoogleIdentity extends ThirdPartyIdentity {
  requiresRefreshToken = true;

  constructor(profile: OAuthConstructor) {
    super('google', profile);
  }
}
