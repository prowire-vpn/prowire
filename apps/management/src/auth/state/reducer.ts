import type {AuthActions} from './action';

export interface AuthState {
  accessToken?: string;
  refreshToken?: string;
  state?: string;
  codeVerifier?: string;
  error?: unknown;
  code?: string;
}

export const initialAuth: AuthState = {
  accessToken: undefined,
  refreshToken: undefined,
  state: undefined,
  error: undefined,
  code: undefined,
};

export function authReducer(config: AuthState, action: AuthActions): AuthState {
  switch (action.type) {
    case 'finishFlow': {
      return {
        ...config,
        state: undefined,
        codeVerifier: undefined,
        code: undefined,
        accessToken: action.payload?.accessToken,
        refreshToken: action.payload?.refreshToken,
      };
    }
    case 'logout': {
      return initialAuth;
    }
    case 'setRefreshToken': {
      return {
        ...config,
        refreshToken: action.payload,
      };
    }
    case 'startFlow': {
      return {
        ...config,
        state: action.payload?.state,
        codeVerifier: action.payload?.codeVerifier,
        error: undefined,
        code: undefined,
      };
    }
    case 'error': {
      return {
        ...config,
        error: action.payload,
      };
    }
    case 'setCode': {
      return {
        ...config,
        code: action.payload,
      };
    }
  }
}
