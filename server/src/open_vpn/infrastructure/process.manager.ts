import {spawn} from 'child_process';
import {Injectable, Logger, OnModuleDestroy} from '@nestjs/common';
import {OpenVpnConfig} from 'open_vpn/domain';
import {writeToTmpFile} from 'utils';
import {TelnetManager} from './telnet.manager';
import {ServerStopEvent} from './telnet.message';
import {EventEmitter2} from '@nestjs/event-emitter';

type SpawnError = Error & {
  /** Error code */
  code?: string;
};

@Injectable()
export class ProcessManager implements OnModuleDestroy {
  private running = false;
  private abortController?: AbortController;

  /** PRocess standard output and error */
  private stdout = '';
  private stderr = '';

  private readonly logger = new Logger(ProcessManager.name);

  constructor(
    private readonly telnetManager: TelnetManager,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onModuleDestroy() {
    await this.telnetManager.disconnect();
    if (this.abortController) this.abortController.abort();
  }

  /** Start the OpenVPN server */
  public async start(config: OpenVpnConfig): Promise<void> {
    if (this.running) throw new Error('Open VPN server is already running');

    const configPath = await writeToTmpFile(config.toString(), {postfix: '.ovpn'});

    this.abortController = new AbortController();

    /** Clear standard outputs */
    this.stdout = '';
    this.stderr = '';

    const process = spawn(
      'openvpn',
      [
        '--config',
        configPath,
        // Start telnet management interface on local socket
        '--management',
        this.telnetManager.TELNET_SOCKET_PATH,
        'unix',
        // Send telnet events for each connection
        '--management-up-down',
        '--management-client-auth',
        '--auth-user-pass-optional',
      ],
      {
        detached: false,
        shell: false,
        signal: this.abortController.signal,
      },
    );

    this.running = true;

    process.on('error', this.onError.bind(this));

    process.on('spawn', this.onSpawn.bind(this));

    process.on('close', this.onClose.bind(this));

    /** Store the standard outputs in memory */
    process.stderr.on('data', (data: Buffer) => {
      this.stdout += data.toString('utf-8');
      this.logger.log(data.toString('utf-8'));
    });
    process.stdout.on('data', (data: Buffer) => {
      this.stderr += data.toString('utf-8');
      this.logger.error(data.toString('utf-8'));
    });
  }

  /** Stop a running OpenVPN process */
  public stop(): void {
    if (!this.running) throw new Error('Open VPN server is not running');
    this.abortController?.abort();
  }

  /** Function called when there is an error on on the process */
  private onError(error: SpawnError): void {
    try {
      // ENOENT is sent when the binary could not be located
      if (error.code === 'ENOENT')
        throw new Error(
          'OpenVPN is not installed on the system, or the openvpn binary location is not in the PATH environment variable',
        );

      // No special handling for this error
      throw error;
    } catch (error) {
      this.logger.error(error);
    }
  }

  /** Function called when OpenVPN is started */
  private onSpawn(): void {
    this.logger.log('Started OpenVPN process');

    this.telnetManager.connect().catch((error) => {
      this.logger.error(error);
      this.stop();
    });
  }

  private onClose(code?: number) {
    this.running = false;
    // On failure exit, we log the stderr
    if (code !== 0) {
      this.logger.log(this.stdout);
      this.logger.error(this.stderr);
    }

    this.logger.log(`OpenVPN server process terminated${code ? ` [${code}]` : ''}`);

    this.eventEmitter.emit(ServerStopEvent.eventName, new ServerStopEvent());
  }

  /** Know if the server is running */
  public isRunning(): boolean {
    return this.running;
  }
}
