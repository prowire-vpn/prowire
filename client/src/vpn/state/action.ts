import {KeyPair} from 'vpn/data';

export interface KeyPairAction {
  type: 'keyPair';
  payload: KeyPair;
}

export type VpnActions = KeyPairAction;
