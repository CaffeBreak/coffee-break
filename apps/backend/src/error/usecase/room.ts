import { UseCaseError } from ".";

export class RoomPasswordDuplicateError extends UseCaseError {
  static {
    this.prototype.name = "RoomPasswordDuplicateError";
  }
  constructor() {
    super("The room password is duplicated");
  }
}

export class RoomOwnerNotFoundError extends UseCaseError {
  static {
    this.prototype.name = "RoomOwnerNotFoundError";
  }
  constructor() {
    super("The room owner is not found");
  }
}

export class RoomNotFoundError extends UseCaseError {
  static {
    this.prototype.name = "RoomNotFoundError";
  }
  constructor() {
    super("The room is not found");
  }
}

export class PasswordMismatchError extends UseCaseError {
  static {
    this.prototype.name = "PasswordMismatchError";
  }
  constructor() {
    super("The room password is mismatched");
  }
}

export class PlayerNameDuplicatedError extends UseCaseError {
  static {
    this.prototype.name = "PlayerNameDuplicatedError";
  }
  constructor() {
    super("Players with the same name cannot be in the same room");
  }
}
