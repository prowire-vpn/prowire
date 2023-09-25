import {generateKeyPair} from './rsa';
import {generateCertificate} from './x509';
import {caAttributes, serverAttributes, clientAttributes} from './x509';
import {writeFileSync, mkdirSync, existsSync} from 'fs';
import {resolve} from 'path';
import {generateDiffieHellmanParameters} from './dh';
import {generateMocks} from './mock';

interface GeneratePkiOptions {
  dir: string;
  mock?: boolean;
}

export async function generatePki(options: GeneratePkiOptions) {
  const {dir, mock} = options;
  // Create directory if it does not exist
  if (!existsSync(dir)) {
    mkdirSync(dir, {recursive: true});
  }

  if (mock) {
    generateMocks(dir);
    return dir;
  }

  const caKeys = generateKeyPair();
  const clientKeys = generateKeyPair();
  const serverKeys = generateKeyPair();

  const caCertificate = generateCertificate(caAttributes, {
    identityKey: caKeys.publicKey,
    signeeKey: caKeys.privateKey,
  });
  const clientCertificate = generateCertificate(clientAttributes, {
    identityKey: clientKeys.publicKey,
    signeeKey: caKeys.privateKey,
  });
  const serverCertificate = generateCertificate(serverAttributes, {
    identityKey: serverKeys.publicKey,
    signeeKey: caKeys.privateKey,
  });

  const dhParams = await generateDiffieHellmanParameters();

  writeFileSync(resolve(dir, 'ca.crt'), caCertificate);
  writeFileSync(resolve(dir, 'ca.key'), caKeys.privateKeyPem);
  writeFileSync(resolve(dir, 'client.crt'), clientCertificate);
  writeFileSync(resolve(dir, 'client.key'), clientKeys.privateKeyPem);
  writeFileSync(resolve(dir, 'server.crt'), serverCertificate);
  writeFileSync(resolve(dir, 'server.key'), serverKeys.privateKeyPem);
  writeFileSync(resolve(dir, 'dh.pem'), dhParams);
  return dir;
}
