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
  constructor(cause?: Error) {
    super("Target data was not found.", { cause });

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, DataNotFoundError.prototype);
  }
}

export class DataSaveError extends RepositoryError {
  static {
    this.prototype.name = "DataSaveError";
  }
  constructor(cause?: Error) {
    super("Data saving failed.", { cause });

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, DataSaveError.prototype);
  }
}
