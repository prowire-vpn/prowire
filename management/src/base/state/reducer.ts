import type {ConfigActions} from './action';

export interface ConfigState {
  managementUrl?: string;
  apiUrl?: string;
  error?: unknown;
}

export const initialConfig: ConfigState = {
  managementUrl: undefined,
  apiUrl: undefined,
  error: undefined,
};

export function configReducer(config: ConfigState, action: ConfigActions): ConfigState {
  switch (action.type) {
    case 'set': {
      return {
        ...config,
        error: undefined,
        managementUrl: action.payload.MANAGEMENT_URL,
        apiUrl: action.payload.API_URL,
      };
    }
    case 'error': {
      return {
        ...config,
        error: action.payload,
      };
    }
  }
}
