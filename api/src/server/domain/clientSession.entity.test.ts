import {build} from 'test';
import {faker} from '@faker-js/faker';

describe('VpnClientSession', () => {
  describe('isOngoing', () => {
    it('should be ongoing if not disconnected', () => {
      const session = build('vpnSession', {disconnectedAt: undefined});
      expect(session.isOngoing).toBe(true);
    });

    it('should not be ongoing if disconnected', () => {
      const session = build('vpnSession', {disconnectedAt: faker.date.past()});
      expect(session.isOngoing).toBe(false);
    });
  });
});
