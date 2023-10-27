import { UseCaseError } from "./common";

export class PlayerNotFoundError extends UseCaseError {
  static {
    this.prototype.name = "PlayerNotFoundError";
  }
  constructor() {
    super("The player is not found");

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, PlayerNotFoundError.prototype);
  }
}

export class AlreadyJoinedOtherRoomError extends UseCaseError {
  static {
    this.prototype.name = "AlreadyJoinedOtherRoomError";
  }
  constructor() {
    super("The player is already joined other room");

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, AlreadyJoinedOtherRoomError.prototype);
  }
}
