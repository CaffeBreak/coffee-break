import { UseCaseError } from "./common";

export class PlayerNotFoundError extends UseCaseError {
  static {
    this.prototype.name = "PlayerNotFoundError";
  }
  constructor() {
    super("The player is not found");
  }
}

export class AlreadyJoinedOtherRoomError extends UseCaseError {
  static {
    this.prototype.name = "AlreadyJoinedOtherRoomError";
  }
  constructor() {
    super("The player is already joined other room");
  }
}
