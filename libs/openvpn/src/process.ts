import {spawn} from 'child_process';
import {OpenVpnConfig} from './config.entity';
import {writeToTmpFile} from './files';
import * as telnetManager from './telnet';
import {VpnStopEvent} from './events';
import {logger} from './log';
import {AlreadyRunningError, OpenVpnNotInstalledError} from './errors';
import {emit} from './callback';

export type SpawnError = Error & {
  /** Error code */
  code?: string;
};

/** Indicates if there is an OpenVPN process running */
export let running = false;
let abortController: AbortController | undefined = undefined;
let stdout = '';
let stderr = '';

export async function start(config: OpenVpnConfig): Promise<void> {
  if (running) throw new AlreadyRunningError();

  const configPath = await writeToTmpFile(config.toString(), {suffix: '.ovpn'});

  abortController = new AbortController();

  /** Clear standard outputs */
  stdout = '';
  stderr = '';

  const process = spawn(
    'openvpn',
    [
      '--config',
      configPath,
      // Start telnet management interface on local socket
      '--management',
      telnetManager.TELNET_SOCKET_PATH,
      'unix',
      // Send telnet events for each connection
      '--management-up-down',
      '--management-client-auth',
      '--auth-user-pass-optional',
    ],
    {
      detached: false,
      shell: false,
      signal: abortController.signal,
    },
  );

  running = true;

  process.on('error', onError);

  process.on('spawn', onSpawn);

  process.on('close', onClose);

  /** Store the standard outputs in memory */
  process.stderr.on('data', (data: Buffer) => {
    stdout += data.toString('utf-8');
    logger.log(data.toString('utf-8'));
  });
  process.stdout.on('data', (data: Buffer) => {
    stderr += data.toString('utf-8');
    logger.error(data.toString('utf-8'));
  });
}

/** Stop a running OpenVPN process */
export function stop(): void {
  if (!running) throw new Error('Open VPN server is not running');
  abortController?.abort();
}

/** Function called when there is an error on on the process */
function onError(error: SpawnError): void {
  try {
    // ENOENT is sent when the binary could not be located
    if (error.code === 'ENOENT') throw new OpenVpnNotInstalledError();

    // No special handling for this error
    throw error;
  } catch (error) {
    logger.error(error);
  }
}

/** Function called when OpenVPN is started */
function onSpawn(): void {
  logger.log('Started OpenVPN process');

  telnetManager.connect().catch((error) => {
    logger.error(error);
    stop();
  });
}

function onClose(code?: number) {
  running = false;
  // On failure exit, we log the stderr
  if (code !== 0) {
    logger.log(stdout);
    logger.error(stderr);
  }

  logger.log(`OpenVPN server process terminated${code ? ` [${code}]` : ''}`);

  emit(new VpnStopEvent());
}
