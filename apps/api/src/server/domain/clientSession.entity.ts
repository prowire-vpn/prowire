import {Base, type BaseConstructor} from 'app/domain';
import {type IResult as UserAgent} from 'ua-parser-js';

export type VpnClientSessionConstructorOptions = BaseConstructor & {
  userId: string;
  device: UserAgent;
  connectingAddress: string;
  createdAt?: Date;
  connectedAt?: Date;
  addressAssignedAt?: Date;
  disconnectedAt?: Date;
  serverId?: string;
  assignedAddress?: string;
  bytesIn?: number;
  bytesOut?: number;
};

/** This class represents a single VPN session for a user */
export class VpnClientSession extends Base {
  public readonly userId: string;
  public readonly device: UserAgent;
  public readonly connectingAddress: string;
  public readonly createdAt: Date;
  public connectedAt?: Date;
  public addressAssignedAt?: Date;
  public disconnectedAt?: Date;
  public serverId?: string;
  public assignedAddress?: string;
  public bytesIn: number;
  public bytesOut: number;

  constructor(data: VpnClientSessionConstructorOptions) {
    super(data);
    this.userId = data.userId;
    this.device = data.device;
    this.connectingAddress = data.connectingAddress;
    this.createdAt = data.createdAt ?? new Date();
    this.connectedAt = data.connectedAt;
    this.addressAssignedAt = data.addressAssignedAt;
    this.disconnectedAt = data.disconnectedAt;
    this.serverId = data.serverId;
    this.assignedAddress = data.assignedAddress;
    this.bytesIn = data.bytesIn ?? 0;
    this.bytesOut = data.bytesOut ?? 0;
    this.initialized = true;
  }

  get isOngoing(): boolean {
    return !this.disconnectedAt;
  }

  connect(serverId: string): void {
    this.connectedAt = this.connectedAt ?? new Date();
    this.serverId = serverId;
  }

  disconnect(): void {
    this.disconnectedAt = new Date();
  }

  assignAddress(address: string): void {
    this.addressAssignedAt = new Date();
    this.assignedAddress = address;
  }
}
