export class StateNotFoundError extends Error {
  constructor(state: string) {
    super(`Cannot find state ${state}`);
  }
}

export class StateAlreadyExistsError extends Error {
  constructor(state: string) {
    super(`State ${state} already exists`);
  }
}
