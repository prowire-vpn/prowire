import {type GetClientConfigResponseBody} from 'base/data';

export interface SetApiUrlAction {
  type: 'set';
  payload: GetClientConfigResponseBody;
}

export interface SetErrorAction {
  type: 'error';
  payload?: unknown;
}

export type ConfigActions = SetApiUrlAction | SetErrorAction;
