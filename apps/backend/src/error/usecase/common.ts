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
