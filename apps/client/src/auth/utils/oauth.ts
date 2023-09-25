import base64url from 'crypto-js/enc-base64url';
import hex from 'crypto-js/enc-hex';
import TypedArrays from 'crypto-js/lib-typedarrays';
import sha256 from 'crypto-js/sha256';

export function generatePkceFlowStartData() {
  const state = TypedArrays.random(32);
  const codeVerifier = TypedArrays.random(32);
  const codeChallenge = sha256(codeVerifier);
  return {
    state: hex.stringify(state),
    codeVerifier: base64url.stringify(codeVerifier),
    codeChallenge: base64url.stringify(codeChallenge),
  };
}
