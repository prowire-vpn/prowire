import {Connection, connections} from 'mongoose';

export function getReadyConnection(): Connection {
  const [connection] = connections.filter(({readyState}) => readyState === 1);
  return connection;
}

export function getModel(name: string) {
  return getReadyConnection().models[name];
}
