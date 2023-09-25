import {expect} from 'chai';
import {cidrToNetMask} from './cidr';

describe('VPN - Utils - CIDR', () => {
  it('should calculate network mask from CIDR', () => {
    const cidr = '10.8.0.0/24';
    const result = cidrToNetMask(cidr);
    expect(result.ip).to.equal('10.8.0.0');
    expect(result.mask).to.equal('255.255.255.0');
  });
});
