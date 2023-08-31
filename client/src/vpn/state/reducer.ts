import {VpnActions} from './action';

export interface VpnState {
  publicKey?: string;
  privateKey?: string;
}

export const initialState: VpnState = {};

export function vpnReducer(config: VpnState, action: VpnActions): VpnState {
  switch (action.type) {
    case 'keyPair': {
      return {
        ...config,
        publicKey: action.payload.publicKey,
        privateKey: action.payload.privateKey,
      };
    }
    default: {
      return config;
    }
  }
}
