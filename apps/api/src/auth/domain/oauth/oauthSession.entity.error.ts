export class CodeAlreadyIssuedError extends Error {
  constructor() {
    super('Code has already been issued');
  }
}

export class CodeNotIssuedError extends Error {
  constructor() {
    super('Code has not been issued');
  }
}
