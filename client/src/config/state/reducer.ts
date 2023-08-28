import {ConfigActions} from './action';

export interface ConfigState {
  inputApiUrl?: string;
  apiUrl?: string;
  error?: unknown;
}

export const initialConfig: ConfigState = {apiUrl: undefined, error: undefined};

export function configReducer(
  config: ConfigState,
  action: ConfigActions,
): ConfigState {
  switch (action.type) {
    case 'input': {
      return {
        ...config,
        error: undefined,
        inputApiUrl: action.payload,
      };
    }
    case 'validate': {
      return {
        ...config,
        error: undefined,
        inputApiUrl: undefined,
        apiUrl: action.payload,
      };
    }
    case 'error': {
      return {
        ...config,
        error: action.payload,
      };
    }
    case 'clear': {
      return initialConfig;
    }
  }
}
