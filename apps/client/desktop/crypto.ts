import crypto from 'crypto';

export async function generateKeyPair() {
  const keyPair = await new Promise<{
    publicKey: crypto.KeyObject;
    privateKey: crypto.KeyObject;
  }>((resolve, reject) => {
    crypto.generateKeyPair(
      'rsa',
      {modulusLength: 2048},
      (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({publicKey, privateKey});
      },
    );
  });

  return {
    publicKey: keyPair.publicKey.export({type: 'spki', format: 'pem'}),
    privateKey: keyPair.privateKey.export({type: 'pkcs8', format: 'pem'}),
  };
}
