import {Telnet, type SendOptions} from 'telnet-client';
import {setTimeout} from 'timers/promises';
import {existsSync} from 'fs';
import {telnetEvents, VpnReadyEvent} from './events';
import {logger} from './log';
import {emit} from './callback';
import {TelnetSocketUnreachableError, TelnetUnreachableServer} from './errors';

export const TELNET_SOCKET_PATH = '/tmp/prowire-openvpn';

let telnet: Telnet | undefined = undefined;
let BufferedMessage: (typeof telnetEvents)[number] | undefined = undefined;
let bufferedMessageContent: Array<string> = [];

export interface TelnetOptions {
  retries?: number;
  delay?: number;
  byteCountInterval?: number;
}
let options = {
  retries: 5,
  delay: 1000,
  bytCountInterval: 10,
};

export function setOptions(newOptions: Partial<TelnetOptions>) {
  options = {
    ...options,
    ...newOptions,
  };
}

export async function connect(retry = 0): Promise<void> {
  telnet = new Telnet();

  telnet.on('connect', onConnect);
  telnet.on('error', onError);
  telnet.on('end', onEnd);
  telnet.on('close', onClose);
  telnet.on('data', onData);

  try {
    // Check that the socket exists already
    if (!existsSync(TELNET_SOCKET_PATH)) throw new TelnetSocketUnreachableError();

    // Attempt connection
    await telnet.connect({
      socketConnectOptions: {path: TELNET_SOCKET_PATH},
      negotiationMandatory: false,
      echoLines: 2,
    });
  } catch (error) {
    // Connection is retried if it failed
    logger.error(error);
    if (retry >= options.retries) {
      logger.error('Failed to establish OpenVPN telnet connection after 5 retries');
      throw new TelnetUnreachableServer();
    }
    logger.log('Retrying to establish Telnet connection in 1s');
    await setTimeout(options.delay);
    await connect(retry + 1);
  }
}

export async function disconnect(): Promise<void> {
  await telnet?.destroy();
}

interface AuthorizeClientParams {
  cid: string;
  kid: string;
}

/** Authorize a client connection or re-authentication request. This MUST be called after receiving a "client-connect" event */
export async function authorizeClient(client: AuthorizeClientParams): Promise<void> {
  await send(`client-auth ${client.cid} ${client.kid}\nEND`);
}

function send(command: string, options?: SendOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    telnet
      ?.send(command, {
        ors: '\r\n',
        waitfor: 'SUCCESS: ',
        ...options,
      })
      .then(resolve)
      .catch(reject);
  });
}

async function onConnect(): Promise<void> {
  emit(new VpnReadyEvent());
  await send(`bytecount ${options.bytCountInterval}`, {
    waitFor: 'SUCCESS: bytecount interval changed',
  });
}

function onError(error: Error): void {
  logger.log('ERROR');
  logger.error(error);
}

function onEnd(): void {
  logger.log('END');
}

function onClose(): void {
  logger.log('CLOSE');
}

function onData(data: Buffer) {
  const content = data.toString();
  logger.verbose('Received message from OpenVPN server');

  // If we are currently buffering a message, we need to check if the new data completes it
  if (BufferedMessage) {
    bufferedMessageContent.push(content);
    if (BufferedMessage.findEnd(content)) {
      emit(new BufferedMessage(bufferedMessageContent.join('\n')));
      BufferedMessage = undefined;
      bufferedMessageContent = [];
    }
    return;
  }

  for (const Message of telnetEvents) {
    if (Message.findStart(content)) {
      // When the message is always expected to be a single line, we can build it immediately
      if (Message.findEnd(content)) return emit(new Message(content));

      // When the message is expected to be multiple lines, we need to wait for the end
      BufferedMessage = Message;
      bufferedMessageContent = [content];
    }
  }
}

export const _test_only = {onData};
