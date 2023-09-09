export class ServerNotFoundError extends Error {
  constructor(name: string) {
    super(`Can not find server with name "${name}"`);
  }
}
