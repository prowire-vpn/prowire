import {OpenVpnConfig} from './config.entity';
import {setLogger} from './log';
import * as telnetManager from './telnet';
import * as processManager from './process';

export * from './config.entity';
export * from './events';
export * from './errors';

export type OpenVpnOptions = telnetManager.TelnetOptions & {
  logger?: Parameters<typeof setLogger>[0];
};

export {running} from './process';

/** Start an OpenVPN process */
export async function start(config: OpenVpnConfig, options?: OpenVpnOptions) {
  if (options?.logger) setLogger(options.logger);
  if (options) telnetManager.setOptions(options);
  await processManager.start(config);
}

/** Stop the running OpenVPN process */
export const stop = async () => {
  await telnetManager.disconnect();
  processManager.stop();
};
export {on} from './callback';
export {authorizeClient} from './telnet';
