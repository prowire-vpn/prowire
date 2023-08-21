import {ConfigActions} from './action';
import {} from './ConfigProvider';

export interface ConfigState {
  apiUrl?: string;
}

export const initialConfig: ConfigState = {apiUrl: undefined};

export function configReducer(
  config: ConfigState,
  action: ConfigActions,
): ConfigState {
  switch (action.type) {
    case 'setApiUrl': {
      return {
        ...config,
        apiUrl: action.payload,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
