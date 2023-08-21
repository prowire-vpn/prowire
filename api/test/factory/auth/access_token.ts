import {NotImplementedException} from '@nestjs/common';
import {ClientConstructor, AccessToken} from 'auth/domain';
import {clientFactory} from './client';
import {SignOptions} from 'jsonwebtoken';

export const accessTokenFactory = {
  build(overrides?: Partial<ClientConstructor> & {options?: SignOptions}): AccessToken {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) throw new Error('Env: ACCESS_TOKEN_SECRET is not defined');
    const options: SignOptions = {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION ?? '1d',
      issuer: process.env.SERVER_ID,
      audience: process.env.SERVER_ID && [process.env.SERVER_ID],
      ...overrides?.options,
    };
    if (!options.issuer) throw new Error('Env: SERVER_ID is not defined');
    const client = clientFactory.build(overrides);
    return new AccessToken(client, secret, options);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async persist(client: AccessToken): Promise<AccessToken> {
    throw new NotImplementedException();
  },
};
