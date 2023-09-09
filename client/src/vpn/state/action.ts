import {ConnectServerResponseBodyDto} from '@prowire-vpn/api';
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

export interface VpnStartAction {
  type: 'start';
  payload: ConnectServerResponseBodyDto;
}

export interface VpnStatusAction {
  type: 'state';
  payload: VpnConnectionState;
}

export type VpnActions = KeyPairAction | VpnStartAction | VpnStatusAction;
