export type VpnConfigConstructor = {
  protocol?: 'tcp' | 'udp';
  mode?: 'tun' | 'tap';
  subnet: Subnet;
  routes: Array<Subnet>;
};

export class Subnet {
  public ip: string;
  public bits: number;

  constructor(cidr: string) {
    const [ip, bits] = cidr.split('/');
    this.ip = ip;
    this.bits = parseInt(bits);
  }

  public toIpWithMask(): string {
    return `${this.ip} ${this.getMask()}`;
  }

  private getMask(): string {
    const mask: Array<number> = [];
    let n: number;
    let bitCount = this.bits;
    for (let i = 0; i < 4; i++) {
      n = Math.min(bitCount, 8);
      mask.push(256 - Math.pow(2, 8 - n));
      bitCount -= n;
    }
    return mask.join('.');
  }
}

export class VpnConfig {
  public protocol: 'tcp' | 'udp';
  public mode: 'tun' | 'tap';
  public subnet: Subnet;
  public routes: Array<Subnet>;

  constructor(options: VpnConfigConstructor) {
    this.protocol = options.protocol ?? 'udp';
    this.mode = options.mode ?? 'tun';
    this.subnet = options.subnet;
    this.routes = options.routes;
  }

  static getDefaultConfig(): VpnConfig {
    return new VpnConfig({
      subnet: new Subnet('10.8.0.0/24'),
      routes: [new Subnet('10.8.0.0/24')],
    });
  }
}
