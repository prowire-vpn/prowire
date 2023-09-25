import {build} from 'test';
import {AccessToken} from './access_token.entity';

describe('AccessToken', () => {
  describe('verifyPayload', () => {
    it('should throw an error if the payload is not valid', () => {
      const payload = {};

      expect(() => AccessToken.verifyPayload(payload)).toThrow();
    });

    it('should not throw if the payload is valid', () => {
      const client = build('client');
      const payload = {admin: client.admin, sub: client.id};

      expect(() => AccessToken.verifyPayload(payload)).not.toThrow();
    });

    it('should return a valid payload', () => {
      const client = build('client');
      const payload = {admin: client.admin, sub: client.id};

      const result = AccessToken.verifyPayload(payload);

      expect(result).toEqual(payload);
    });

    it('should remove additional properties of a valid payload', () => {
      const client = build('client');
      const payload = {admin: client.admin, sub: client.id, foo: 'bar'};

      const result = AccessToken.verifyPayload(payload);

      expect(result).not.toEqual(payload);
    });
  });
});
