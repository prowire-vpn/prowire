import {eventsMap} from './events';

type EventMap = typeof eventsMap;
type EventName = keyof EventMap;

type Callback<T extends EventName> = (event: InstanceType<EventMap[T]>) => void;

type Callbacks = {
  [K in EventName]: Array<Callback<K>>;
};

const callbacks: Callbacks = {
  bytecount: [],
  'bytecount-cli': [],
  'client-connect': [],
  'client-disconnect': [],
  'client-address': [],
  'vpn-ready': [],
  'vpn-stop': [],
};

/**
 * Register an event listener
 * @param name - The name of the event to listen for
 * @param callback - The callback to execute when the event is emitted
 */
export function on<T extends EventName>(name: T, callback: Callback<T>) {
  callbacks[name].push(callback);
}

export function emit<T extends EventName>(event: InstanceType<EventMap[T]>) {
  const name = event.eventName as T;
  if (!callbacks[name]) return;
  callbacks[name].forEach((callback) => callback(event));
}

on('client-connect', (event) => {
  event.client;
});
