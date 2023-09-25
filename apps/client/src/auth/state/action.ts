export interface SetAuthToken {
  type: 'finishFlow';
  payload?: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LogoutAction {
  type: 'logout';
}

export interface SetRefreshToken {
  type: 'setRefreshToken';
  payload: string;
}

export interface StartFlow {
  type: 'startFlow';
  payload?: {
    state: string;
    codeVerifier: string;
  };
}

export interface SetError {
  type: 'error';
  payload?: unknown;
}

export interface SetCode {
  type: 'setCode';
  payload?: string;
}

export type AuthActions =
  | SetAuthToken
  | LogoutAction
  | SetRefreshToken
  | StartFlow
  | SetError
  | SetCode;
