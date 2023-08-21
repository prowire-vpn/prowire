export interface SetApiUrlAction {
  type: 'setApiUrl';
  payload?: string;
}

export type ConfigActions = SetApiUrlAction;
