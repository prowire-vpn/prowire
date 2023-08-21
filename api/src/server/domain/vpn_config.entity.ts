export type VpnConfigConstructor = Pick<VpnConfig, 'routes' | 'subnet'>;

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
  public routes: Subnet[];
  public subnet: Subnet;

  constructor(options: VpnConfigConstructor) {
    this.routes = options.routes;
    this.subnet = options.subnet;
  }

  static getDefaultConfig(): VpnConfig {
    return new VpnConfig({subnet: new Subnet('10.8.0.0/24'), routes: []});
  }
}
