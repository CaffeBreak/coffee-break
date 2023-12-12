import { UseCaseError } from "./common";

export class RoomPasswordDuplicateError extends UseCaseError {
  static {
    this.prototype.name = "RoomPasswordDuplicateError";
  }
  constructor() {
    super("The room password is duplicated");

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, RoomPasswordDuplicateError.prototype);
  }
}

export class RoomOwnerNotFoundError extends UseCaseError {
  static {
    this.prototype.name = "RoomOwnerNotFoundError";
  }
  constructor() {
    super("The room owner is not found");

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, RoomOwnerNotFoundError.prototype);
  }
}

export class RoomNotFoundError extends UseCaseError {
  static {
    this.prototype.name = "RoomNotFoundError";
  }
  constructor() {
    super("The room is not found");

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, RoomNotFoundError.prototype);
  }
}

export class PasswordMismatchError extends UseCaseError {
  static {
    this.prototype.name = "PasswordMismatchError";
  }
  constructor() {
    super("The room password is mismatched");

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, PasswordMismatchError.prototype);
  }
}

export class PlayerNameDuplicatedError extends UseCaseError {
  static {
    this.prototype.name = "PlayerNameDuplicatedError";
  }
  constructor() {
    super("Players with the same name cannot be in the same room");

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, PlayerNameDuplicatedError.prototype);
  }
}

export class PlayerNotJoinedRoomError extends UseCaseError {
  static {
    this.prototype.name = "PlayerNotJoinedRoomError";
  }
  constructor() {
    super("The player is not joind any room");

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, PlayerNotJoinedRoomError.prototype);
  }
}

export class NotEnoughPlayersError extends UseCaseError {
  static {
    this.prototype.name = "NotEnoughPlayersError";
  }
  constructor() {
    super("Not enough players are joined in this room");

    // Error.captureStackTraceはV8 Engineのみに存在する
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, NotEnoughPlayersError.prototype);
  }
}
