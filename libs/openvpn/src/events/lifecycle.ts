import {Event} from './abstract';

/** OpenVPN is fully started and ready to accept connections (or connected to a server) */
export class VpnReadyEvent extends Event {
  public static readonly eventName = 'vpn-ready';
}

/** OpenVPN has been killed */
export class VpnStopEvent extends Event {
  public static readonly eventName = 'vpn-stop';
}
