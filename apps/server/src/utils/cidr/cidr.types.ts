/** Represents an IP range as an IP address with a network mask */
export interface IpWithMask {
  /** Base IP address */
  ip: string;
  /** Network mask */
  mask: string;
}
