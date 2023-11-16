export abstract class RepositoryError extends Error {
  static {
    this.prototype.name = "RepositoryError";
  }
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, RepositoryError.prototype);
  }
}

export class DataNotFoundError extends RepositoryError {
  static {
    this.prototype.name = "DataNotFoundError";
  }
  constructor() {
    super("Target data was not found.");

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, DataNotFoundError.prototype);
  }
}
