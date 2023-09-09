import {VpnActions, VpnConnectionState} from './action';

export interface VpnState {
  publicKey?: string;
  privateKey?: string;
  ca?: string;
  certificate?: string;
  mode?: string;
  protocol?: string;
  servers: Array<{ip: string; port: number}>;
  state: VpnConnectionState;
}

export const initialState: VpnState = {
  servers: [],
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
    case 'start': {
      return {
        ...config,
        ca: action.payload.ca,
        certificate: action.payload.certificate,
        mode: action.payload.mode,
        protocol: action.payload.protocol,
        servers: action.payload.servers,
      };
    }
    case 'state': {
      return {
        ...config,
        state: action.payload,
      };
    }
    default: {
      return config;
    }
  }
}
