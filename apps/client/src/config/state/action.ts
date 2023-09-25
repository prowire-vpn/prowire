export interface InputApiUrlAction {
  type: 'input';
  payload?: string;
}

export interface SetApiUrlAction {
  type: 'validate';
  payload?: string;
}

export interface ClearAction {
  type: 'clear';
}

export interface SetErrorAction {
  type: 'error';
  payload?: unknown;
}

export interface ApiHealthAction {
  type: 'apiHealth';
  payload: boolean;
}

export type ConfigActions =
  | ClearAction
  | InputApiUrlAction
  | SetApiUrlAction
  | SetErrorAction
  | ApiHealthAction;
