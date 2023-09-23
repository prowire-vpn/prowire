import b64 from 'crypto-js/enc-base64';
import utf8 from 'crypto-js/enc-utf8';

interface TokenPayload {
  sub: string;
  exp: number;
  iat: number;
}

function parseToken(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token');
  }
  return {
    header: JSON.parse(utf8.stringify(b64.parse(parts[0]))) as unknown,
    payload: JSON.parse(utf8.stringify(b64.parse(parts[1]))) as TokenPayload,
    signature: b64.parse(parts[2]),
  };
}

/** Get in how many milliseconds a token will expire */
export function getTokenExpiration(token: string): number {
  const {
    payload: {exp},
  } = parseToken(token);
  const now = Date.now();
  const diff = exp * 1000 - now;
  return diff;
}
