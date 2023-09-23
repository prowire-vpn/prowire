import {isBefore, addMinutes} from 'date-fns';
import {randomBytes} from 'crypto';
import {Client} from 'auth/domain/client.entity';
import {Base} from 'app/domain';
import {type ID} from 'types';
import {CodeAlreadyIssuedError, CodeNotIssuedError} from './oauthSession.entity.error';
import {type IdentityProvider} from 'organization/domain';

export interface OAuthSessionConstructor {
  id?: ID<OAuthSession>;
  userId?: string;
  started_at?: Date;
  state: string;
  code_challenge: string;
  redirect_uri: string;
  code?: string;
  code_issued_at?: Date;
  code_used?: boolean;
  provider: IdentityProvider;
}

export class OAuthSession extends Base {
  userId?: string;
  started_at: Date;
  state: string;
  code_challenge: string;
  redirect_uri: string;
  code?: string;
  code_issued_at?: Date;
  code_used: boolean;
  provider: IdentityProvider;

  constructor(data: OAuthSessionConstructor) {
    super(data);
    this.userId = data.userId;
    this.started_at = data.started_at ?? new Date();
    this.state = data.state;
    this.code_challenge = data.code_challenge;
    this.redirect_uri = data.redirect_uri;
    this.code = data.code;
    this.code_issued_at = data.code_issued_at;
    this.code_used = data.code_used ?? false;
    this.provider = data.provider;
    this.initialized = true;
  }

  get state_used(): boolean {
    return !!this.code_issued_at;
  }

  get hasValidState(): boolean {
    return !this.state_used && isBefore(new Date(), addMinutes(this.started_at, 10));
  }

  get hasValidCode(): boolean {
    return (
      !this.code_used &&
      !!this.code_issued_at &&
      isBefore(new Date(), addMinutes(this.code_issued_at, 1))
    );
  }

  public issueCode(client: Client): void {
    if (this.code) throw new CodeAlreadyIssuedError();
    this.userId = client.id;
    this.code = randomBytes(32).toString('base64url');
    this.code_issued_at = new Date();
  }

  public get redirectionUrl(): string {
    if (!this.code) throw new CodeNotIssuedError();
    const url = new URL(this.redirect_uri);
    url.searchParams.append('state', this.state);
    url.searchParams.append('code', this.code);
    url.searchParams.append('provider', this.provider);
    return url.toString();
  }

  public useCode(): void {
    if (!this.code) throw new CodeNotIssuedError();
    this.code_used = true;
  }
}
