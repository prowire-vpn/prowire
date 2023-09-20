import {VpnClientSessionDto} from '@prowire-vpn/api';
import {formatDistanceToNow, formatDistance, formatDuration, intervalToDuration} from 'date-fns';
import prettyBytes from 'pretty-bytes';

export class UserClientSession {
  public readonly id: string;
  public readonly userId: string;
  public readonly device: VpnClientSessionDto['device'];
  public readonly connectingAddress: string;
  public readonly createdAt: Date;
  public readonly connectedAt?: Date;
  public readonly addressAssignedAt?: Date;
  public readonly disconnectedAt?: Date;
  public readonly serverId?: string;
  public readonly assignedAddress?: string;
  public readonly bytesIn: number;
  public readonly bytesOut: number;

  public constructor(dto: VpnClientSessionDto) {
    this.id = dto.id;
    this.userId = dto.userId;
    this.device = dto.device;
    this.connectingAddress = dto.connectingAddress;
    this.createdAt = new Date(dto.createdAt);
    this.connectedAt = dto.connectedAt ? new Date(dto.connectedAt) : undefined;
    this.addressAssignedAt = dto.addressAssignedAt ? new Date(dto.addressAssignedAt) : undefined;
    this.disconnectedAt = dto.disconnectedAt ? new Date(dto.disconnectedAt) : undefined;
    this.serverId = dto.serverId;
    this.assignedAddress = dto.assignedAddress;
    this.bytesIn = dto.bytesIn;
    this.bytesOut = dto.bytesOut;
  }

  public get createdAtFormatted(): string {
    return this.createdAt.toLocaleString();
  }

  public get createdAtRelative(): string {
    return formatDistanceToNow(this.createdAt, {addSuffix: true});
  }

  public get connectedAtFormatted(): string | undefined {
    return this.connectedAt?.toLocaleString();
  }

  public get connectedAtRelative(): string | undefined {
    return this.connectedAt ? formatDistanceToNow(this.connectedAt, {addSuffix: true}) : undefined;
  }

  public get addressAssignedAtFormatted(): string | undefined {
    return this.addressAssignedAt?.toLocaleString();
  }

  public get addressAssignedAtRelative(): string | undefined {
    return this.addressAssignedAt
      ? formatDistanceToNow(this.addressAssignedAt, {addSuffix: true})
      : undefined;
  }

  public get disconnectedAtFormatted(): string | undefined {
    return this.disconnectedAt?.toLocaleString();
  }

  public get disconnectedAtRelative(): string | undefined {
    return this.disconnectedAt
      ? formatDistanceToNow(this.disconnectedAt, {addSuffix: true})
      : undefined;
  }

  public get durationFormatted(): string {
    const duration = intervalToDuration({
      start: this.createdAt,
      end: this.disconnectedAt ?? new Date(),
    });
    return formatDuration(duration);
  }

  public get durationRelative(): string {
    return formatDistance(this.createdAt, this.disconnectedAt ?? new Date());
  }

  public get isConnected(): boolean {
    return !this.disconnectedAt;
  }

  public get bytesInFormatted(): string {
    return prettyBytes(this.bytesIn);
  }

  public get bytesOutFormatted(): string {
    return prettyBytes(this.bytesOut);
  }
}
