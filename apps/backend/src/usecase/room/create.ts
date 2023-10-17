import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import type { IPlayerRepository } from "@/domain/repository/interface/playerRepository";
import type { IRoomRepository } from "@/domain/repository/interface/roomRepository";

import { PlayerId } from "@/domain/entity/player";
import { Room, RoomPassword } from "@/domain/entity/room";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";
import { AlreadyJoinedOtherRoomError } from "@/error/usecase/player";
import { RoomOwnerNotFoundError, RoomPasswordDuplicateError } from "@/error/usecase/room";

@injectable()
export class CreateRoomUseCase {
  constructor(
    @inject("RoomRepository") private roomRepository: IRoomRepository,
    @inject("PlayerRepository") private playerRepository: IPlayerRepository,
  ) {}

  public execute(password: RoomPassword, ownerId: PlayerId): Result<Room, UseCaseError> {
    // 同じ合言葉の部屋は作れない
    if (this.roomRepository.findByPassword(password).ok) {
      return new Err(new RoomPasswordDuplicateError());
    }

    const ownerResult = this.playerRepository.findById(ownerId);
    // 部屋作成者が存在しない場合、部屋は作れない
    if (ownerResult.err) {
      return new Err(new RoomOwnerNotFoundError());
    }

    // 部屋作成者がすでに他の部屋に参加している場合は部屋を作成できない
    if (ownerResult.unwrap().roomId) {
      return new Err(new AlreadyJoinedOtherRoomError());
    }
    const newRoom = Room.new(password, ownerId);

    const roomResult = this.roomRepository.save(newRoom);
    if (roomResult.err) {
      return new Err(new RepositoryOperationError(roomResult.val));
    }

    return new Ok(roomResult.unwrap());
  }
}
