export class AlreadyRunningError extends Error {
  constructor() {
    super('An OpenVPN process is already running');
  }
}

export class OpenVpnNotInstalledError extends Error {
  constructor() {
    super(
      'OpenVPN is not installed on the system, or the openvpn binary location is not in the PATH environment variable',
    );
  }
}

export class TelnetSocketUnreachableError extends Error {
  constructor() {
    super('Could not connect to the OpenVPN telnet socket, is OpenVPN running?');
  }
}

export class TelnetUnreachableServer extends Error {
  constructor() {
    super('The OpenVPN telnet server is unreachable on the socket path after multiple tries');
  }
}
