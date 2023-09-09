import {storeItem, clearItem, getItem} from 'base/state/storage';

export const AUTH_NAMESPACE = 'auth';
export const REFRESH_TOKEN_KEY = `${AUTH_NAMESPACE}:refreshToken`;
export const STATE_KEY = `${AUTH_NAMESPACE}:state`;
export const CODE_VERIFIER_KEY = `${AUTH_NAMESPACE}:codeVerifier`;

export function getRefreshToken() {
  return getItem(REFRESH_TOKEN_KEY);
}
export function storeRefreshToken(item: string) {
  storeItem(REFRESH_TOKEN_KEY, item);
}

export function clearRefreshToken() {
  clearItem(REFRESH_TOKEN_KEY);
}

export function getState() {
  return getItem(STATE_KEY);
}

export function storeState(item: string) {
  storeItem(STATE_KEY, item);
}

export function clearState() {
  clearItem(STATE_KEY);
}

export function getCodeVerifier() {
  return getItem(CODE_VERIFIER_KEY);
}

export function storeCodeVerifier(item: string) {
  storeItem(CODE_VERIFIER_KEY, item);
}

export function clearCodeVerifier() {
  clearItem(CODE_VERIFIER_KEY);
}
