import {Injectable} from '@nestjs/common';
import {type KeyPair} from './pki.service.interface';
import {generateKeyPairSync} from 'crypto';

@Injectable()
export class PkiService {
  keyPair?: KeyPair;

  /** Generate an ECDSA key pair */
  generateKeyPair(): KeyPair {
    const {privateKey, publicKey} = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {type: 'spki', format: 'pem'},
      privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
    });
    this.keyPair = {private: privateKey, public: publicKey};
    return this.keyPair;
  }

  /** Get the client's key pair */
  getKeyPair(): KeyPair {
    if (this.keyPair) return this.keyPair;
    return this.generateKeyPair();
  }
}
