import {KeyPair} from 'vpn/data';

export type VpnConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'other';

export interface KeyPairAction {
  type: 'keyPair';
  payload: KeyPair;
}

export interface VpnStatusAction {
  type: 'state';
  payload: VpnConnectionState;
}

export type VpnActions = KeyPairAction | VpnStatusAction;
