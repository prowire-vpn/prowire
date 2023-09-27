export {Client} from './abstract';
export * from './lifecycle';
export * from './telnet';

import {VpnReadyEvent, VpnStopEvent} from './lifecycle';
import {
  ByteCountEvent,
  ClientAddressEvent,
  ClientByteCountEvent,
  ClientConnectEvent,
  ClientDisconnectEvent,
} from './telnet';

export type Events =
  | VpnReadyEvent
  | VpnStopEvent
  | ByteCountEvent
  | ClientByteCountEvent
  | ClientConnectEvent
  | ClientDisconnectEvent
  | ClientAddressEvent;

export const telnetEvents = [
  ByteCountEvent,
  ClientByteCountEvent,
  ClientConnectEvent,
  ClientDisconnectEvent,
  ClientAddressEvent,
];

export const events = [...telnetEvents, VpnReadyEvent, VpnStopEvent];

export const eventsMap = {
  [VpnReadyEvent.eventName]: VpnReadyEvent,
  [VpnStopEvent.eventName]: VpnStopEvent,
  [ByteCountEvent.eventName]: ByteCountEvent,
  [ClientByteCountEvent.eventName]: ClientByteCountEvent,
  [ClientConnectEvent.eventName]: ClientConnectEvent,
  [ClientDisconnectEvent.eventName]: ClientDisconnectEvent,
  [ClientAddressEvent.eventName]: ClientAddressEvent,
};
