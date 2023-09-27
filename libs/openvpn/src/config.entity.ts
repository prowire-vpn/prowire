export type OpenVpnConfigConstructor = Pick<
  OpenVpnConfig,
  | 'role'
  | 'protocol'
  | 'mode'
  | 'port'
  | 'dhParam'
  | 'ca'
  | 'certificate'
  | 'key'
  | 'routes'
  | 'subnet'
>;

export class OpenVpnConfig {
  public role: 'server' | 'client';
  public protocol: string;
  public mode: string;
  public port: number;
  public dhParam: string;
  /** Certificate of the CA */
  public ca: string;
  /** Certificate of the OpenVPN process */
  public certificate: string;
  /** Private key of the OpenVPN process */
  public key: string;
  public routes: Array<string>;
  public subnet: string;

  constructor(data: OpenVpnConfigConstructor) {
    this.role = data.role;
    this.protocol = data.protocol;
    this.mode = data.mode;
    this.port = data.port;
    this.dhParam = data.dhParam;
    this.ca = data.ca;
    this.certificate = data.certificate;
    this.key = data.key;
    this.routes = data.routes;
    this.subnet = data.subnet;
  }

  /** @hidden */
  toString(): string {
    const configFile: Array<string> = [];
    // Set in server mode with specified subnet
    configFile.push(`server ${this.subnet}`);
    // Use a subnet topology (https://community.openvpn.net/openvpn/wiki/Topology)
    configFile.push('topology subnet');
    // Use TUN interface
    configFile.push(`dev ${this.mode}`);
    // Use UDP mode
    configFile.push(`proto ${this.protocol}`);
    // Set listening port
    configFile.push(`port ${this.port}`);
    // Add all the routes
    this.routes.forEach((route) => {
      configFile.push(`push "route ${route}"`);
    });
    // Select cryptographic cipher
    configFile.push('cipher AES-256-GCM');
    // Reduce server privilege after initialization
    configFile.push('user nobody');
    configFile.push('group nobody');
    // Avoid attempting to access some resources on restart once non-root
    configFile.push('persist-key');
    configFile.push('persist-tun');
    // Notify clients of restarts, and force clients to notify on exit
    configFile.push('explicit-exit-notify 1');
    configFile.push('push "explicit-exit-notify 1"');
    // Diffie-Hellman parameter file
    configFile.push(`dh ${this.dhParam}`);
    // Ping clients every 10s, and reset connection if no reply in 60s
    configFile.push('keepalive 10 60');
    // Client certificate
    configFile.push('<cert>', this.certificate.trim(), '</cert>');
    // Client private key
    configFile.push('<key>', this.key.trim(), '</key>');
    // CA certificate
    configFile.push('<ca>', this.ca.trim(), '</ca>');
    return configFile.join('\n');
  }
}
