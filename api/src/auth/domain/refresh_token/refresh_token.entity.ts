import {randomBytes, createCipheriv, createDecipheriv} from 'crypto';
import {UserId} from 'user/domain';
import {Client} from '../client.entity';
import * as Joi from 'joi';

interface NewRefreshTokenConstructor {
  client: Client;
}

interface ExistingRefreshTokenConstructor {
  token: string;
}

const tokenBodySchema = Joi.object({
  id: Joi.string().required(),
});

export class RefreshToken {
  subject: UserId;
  private key: Buffer;
  private iv: Buffer;
  private tag: Buffer;
  token: string;

  constructor(data: NewRefreshTokenConstructor | ExistingRefreshTokenConstructor, keyStr: string) {
    this.key = Buffer.from(keyStr, 'base64');
    if ('token' in data) {
      this.token = data.token;
      const rawToken = Buffer.from(this.token, 'base64');
      this.iv = rawToken.subarray(0, 16);
      const cipherText = rawToken.subarray(16, -16);
      this.tag = rawToken.subarray(-16);

      const decipher = createDecipheriv('aes-256-gcm', this.key, this.iv);
      decipher.setAuthTag(this.tag);
      let deciphered = decipher.update(cipherText);
      deciphered = Buffer.concat([deciphered, decipher.final()]);
      const body = JSON.parse(deciphered.toString('utf-8'));
      const {
        value: {id},
      } = tokenBodySchema.validate(body);
      this.subject = id;
      return;
    } else {
      this.subject = data.client.id;
      this.iv = randomBytes(16);
      const tokenContent = Buffer.from(JSON.stringify({id: this.subject}), 'utf-8');
      const cipher = createCipheriv('aes-256-gcm', this.key, this.iv, {authTagLength: 16});
      let ciphered = cipher.update(tokenContent);
      ciphered = Buffer.concat([ciphered, cipher.final()]);
      this.tag = cipher.getAuthTag();
      this.token = Buffer.concat([this.iv, ciphered, this.tag]).toString('base64');
    }
  }

  toString() {
    return this.token;
  }
}
