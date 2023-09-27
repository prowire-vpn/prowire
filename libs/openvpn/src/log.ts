export interface Logger {
  log: (message: unknown) => void;
  error: (message: unknown) => void;
  verbose: (message: unknown) => void;
}

export let logger: Logger = {
  log: (message: unknown) => console.log(message),
  error: (message: unknown) => console.error(message),
  verbose: (message: unknown) => console.log(message),
};

export function setLogger(newLogger: Logger | ((message: unknown) => void)) {
  if (typeof newLogger === 'function') {
    logger = {
      log: newLogger,
      error: newLogger,
      verbose: newLogger,
    };
    return;
  }
  logger = newLogger;
}
