import {WebSocketMessage} from '@prowire-vpn/api';

/** Function that does some business logic on a message */
export type HandlerFunction = (message: WebSocketMessage['payload']) => void;

/** Mapping of all registered message handlers */
export interface MessageHandlersMap {
  [type: string]: Array<HandlerFunction>;
}
