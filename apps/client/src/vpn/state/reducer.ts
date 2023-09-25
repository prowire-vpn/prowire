import {VpnActions, VpnConnectionState} from './action';

export interface VpnState {
  publicKey?: string;
  privateKey?: string;
  state: VpnConnectionState;
  connectedAt?: Date;
}

export const initialState: VpnState = {
  state: 'disconnected',
};

export function vpnReducer(config: VpnState, action: VpnActions): VpnState {
  switch (action.type) {
    case 'keyPair': {
      return {
        ...config,
        publicKey: action.payload.publicKey,
        privateKey: action.payload.privateKey,
      };
    }
    case 'state': {
      return {
        ...config,
        state: action.payload,
        connectedAt: action.payload === 'connected' ? new Date() : undefined,
      };
    }
    default: {
      return config;
    }
  }
}
