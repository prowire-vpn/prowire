import { pki } from "node-forge";

export function generateKeyPair() {
  const keyPair = pki.rsa.generateKeyPair(2048);
  return {
    ...keyPair,
    privateKeyPem: pki.privateKeyToPem(keyPair.privateKey),
  };
}
