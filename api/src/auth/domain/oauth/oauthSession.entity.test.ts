import {build} from 'test';
import {CodeAlreadyIssuedError, CodeNotIssuedError} from './oauthSession.entity.error';

describe('OAuthSession', () => {
  describe('state_used', () => {
    it('should return true if the code has already been issued', () => {
      const session = build('oauthSession', {code_issued_at: new Date()});

      expect(session.state_used).toBe(true);
    });

    it('should return false if the code has not been issued', () => {
      const session = build('oauthSession', {code_issued_at: undefined});

      expect(session.state_used).toBe(false);
    });
  });

  describe('hasValidState', () => {
    it('should not consider state as valid if the code has already been issues', () => {
      const session = build('oauthSession', {code_issued_at: new Date(), started_at: new Date()});

      expect(session.hasValidState).toBe(false);
    });

    it('should not consider state as valid if it was issued more than 10 minutes from now', () => {
      const session = build('oauthSession', {code_issued_at: undefined, started_at: new Date(0)});

      expect(session.hasValidState).toBe(false);
    });

    it('should consider state valid if it was issued less than 10 minutes from now and code is not issued', () => {
      const session = build('oauthSession', {code_issued_at: undefined, started_at: new Date()});

      expect(session.hasValidState).toBe(true);
    });
  });

  describe('hasValidCode', () => {
    it('should not consider code as valid if it has already been used', () => {
      const session = build('oauthSession', {code_used: true, code_issued_at: new Date()});

      expect(session.hasValidCode).toBe(false);
    });

    it('should not consider code a valid if it was issued more than 1 minute ago', () => {
      const session = build('oauthSession', {code_used: false, code_issued_at: new Date(0)});

      expect(session.hasValidCode).toBe(false);
    });

    it('should consider code as valid it it has not been used and was issued less than 1 minute ago', () => {
      const session = build('oauthSession', {code_used: false, code_issued_at: new Date()});

      expect(session.hasValidCode).toBe(true);
    });
  });

  describe('issueCode', () => {
    it('should throw an error if the code has already been issued', () => {
      const session = build('oauthSession', {code: 'code'});

      expect(() => session.issueCode(build('client'))).toThrowError(CodeAlreadyIssuedError);
    });

    it('should issue a new code, set the user and the issuing time', () => {
      const session = build('oauthSession', {
        code: undefined,
        userId: undefined,
        code_issued_at: undefined,
      });
      const client = build('client');

      session.issueCode(client);
      expect(session.code).toBeDefined();
      expect(session.code_issued_at).toBeDefined();
      expect(session.userId).toBe(client.id);
    });
  });

  describe('redirectionUrl', () => {
    it('should throw an error if the code has not been issued', () => {
      const session = build('oauthSession', {code: undefined});

      expect(() => session.redirectionUrl).toThrowError(CodeNotIssuedError);
    });

    it('should generate an url with the code and the state', () => {
      const session = build('oauthSession', {
        redirect_uri: 'https://cool-site.com',
        code: 'code',
        state: 'state',
      });

      expect(session.redirectionUrl).toBe(
        `https://cool-site.com/?state=${session.state}&code=${session.code}`,
      );
    });
  });

  describe('useCode', () => {
    it('should throw an error if the code has not been issued', () => {
      const session = build('oauthSession', {code: undefined});

      expect(() => session.useCode()).toThrowError(CodeNotIssuedError);
    });

    it('should set the code as used', () => {
      const session = build('oauthSession', {code: 'code', code_used: false});

      session.useCode();
      expect(session.code_used).toBe(true);
    });
  });
});
