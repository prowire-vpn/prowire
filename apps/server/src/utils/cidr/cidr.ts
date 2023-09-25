import {type IpWithMask} from './cidr.types';

const CIDR_REGEX = /^((?:[0-9]{1,3}\.){3}[0-9]{1,3})(?:\/([0-9]|[1-2][0-9]|3[0-2]))?$/;

/** */
export function cidrToNetMask(cidr: string): IpWithMask {
  const match = cidr.match(CIDR_REGEX);
  if (!match) throw new Error('Given value is not a valid CIDR');
  return {
    ip: match[1],
    mask: createNetMask(parseInt(match[2])),
  };
}

/** Converts the significant bits value of a CIDR notation to a network mask notation */
function createNetMask(significantBits: number): string {
  const mask: Array<number> = [];
  let n: number;
  let bitCount = significantBits;
  for (let i = 0; i < 4; i++) {
    n = Math.min(bitCount, 8);
    mask.push(256 - Math.pow(2, 8 - n));
    bitCount -= n;
  }
  return mask.join('.');
}
