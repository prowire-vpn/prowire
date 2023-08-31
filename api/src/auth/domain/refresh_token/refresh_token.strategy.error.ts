export class RefreshTokenNotProvidedError extends Error {
  constructor() {
    super('Refresh token was not provided');
  }
}
