export abstract class ClientError extends Error {
  constructor(
    /** The error code to be returned to the client */
    public errorCode: string,
    /** The message to log on our side */
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
