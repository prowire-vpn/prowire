import {randomUUID} from 'crypto';
import {sign, type Secret, type Algorithm, type SignOptions} from 'jsonwebtoken';
import {type AccessTokenPayload, type AccessTokenOptions} from './access_token.entity.interface';
import * as Joi from 'joi';
import {InvalidAccessTokenPayloadError} from './access_token.entity.error';
import {Client} from 'auth/domain/client.entity';

const payloadSchema = Joi.object<AccessTokenPayload>({
  sub: Joi.string().required(),
  admin: Joi.bool().required(),
});

export class AccessToken {
  id: string;
  algorithm: Algorithm = 'HS256';
  subject: string;
  options: AccessTokenOptions;
  admin: boolean;
  token: string;

  constructor(client: Client, secret: Secret, options: AccessTokenOptions) {
    this.id = randomUUID();
    this.admin = client.admin;
    this.subject = client.id;
    this.options = options;

    this.token = sign(this.payload, secret, this.signOptions);
  }

  public toString() {
    return this.token;
  }

  private get payload(): AccessTokenPayload {
    return {sub: this.subject, admin: this.admin};
  }

  private get signOptions(): SignOptions {
    return {
      ...this.options,
      algorithm: this.algorithm,
    };
  }

  public static verifyPayload(payload: any): AccessTokenPayload {
    // We use stripUnknown to allow additional claims in the token, but ensure they would not be used
    const result = payloadSchema.validate(payload, {stripUnknown: true});
    if (result.error) throw new InvalidAccessTokenPayloadError(result.error);
    return result.value;
  }
}
