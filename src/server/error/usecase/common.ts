import { RepositoryError } from "../repository";

export abstract class UseCaseError extends Error {
  static {
    this.prototype.name = "UseCaseError";
  }
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, UseCaseError.prototype);
  }
}

export class RepositoryOperationError extends UseCaseError {
  static {
    this.prototype.name = "RepositoryOperationError";
  }
  constructor(cause: RepositoryError) {
    super("The error occurred when operating a repository", { cause: cause });

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, RepositoryOperationError.prototype);
  }
}

export class OperationNotAllowedError extends UseCaseError {
  static {
    this.prototype.name = "OperationNotAllowedError";
  }
  constructor() {
    super("The operation is not allowed");

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, OperationNotAllowedError.prototype);
  }
}
