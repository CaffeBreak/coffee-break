import { UseCaseError } from "./common";
import { RepositoryError } from "../repository";

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

export class RepositoryOperationError extends UseCaseError {
  static {
    this.prototype.name = "RepositoryOperationError";
  }
  constructor(cause: RepositoryError) {
    super("The error occurred when operationg a repository", { cause: cause });
  }
}
