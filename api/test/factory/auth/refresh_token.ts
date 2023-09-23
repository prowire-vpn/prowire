import {NotImplementedException} from '@nestjs/common';
import {type ClientConstructor, RefreshToken} from 'auth/domain';
import {clientFactory} from './client';
import {type SignOptions} from 'jsonwebtoken';

export const refreshTokenFactory = {
  build(overrides?: Partial<ClientConstructor> & {options?: SignOptions}): RefreshToken {
    const secret = process.env.REFRESH_TOKEN_KEY_BASE64;
    if (!secret) throw new Error('Env: REFRESH_TOKEN_KEY_BASE64 is not defined');
    const client = clientFactory.build(overrides);
    return new RefreshToken({client}, secret);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async persist(client: RefreshToken): Promise<RefreshToken> {
    throw new NotImplementedException();
  },
};
