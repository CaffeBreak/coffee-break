import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import type { IRoomRepository } from "@/domain/repository/interface/room";

import { PlayerId } from "@/domain/entity/player";
import { RoomId } from "@/domain/entity/room";
import { IPlayerRepository } from "@/domain/repository/interface/player";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";
import { RoomNotFoundError } from "@/error/usecase/room";

@injectable()
export class DeleteRoomUseCase {
  constructor(
    @inject("RoomRepository") private roomRepository: IRoomRepository,
    @inject("PlayerRepository") private playerRepository: IPlayerRepository,
  ) {}

  public execute(id: RoomId, operator: PlayerId): Result<void, UseCaseError> {
    // 該当の部屋が存在しないなら消せない
    const roomResult = this.roomRepository.findById(id);
    if (roomResult.isErr()) {
      return new Err(new RoomNotFoundError());
    }
    const room = roomResult.unwrap();

    // 部屋を削除する
    const roomRepoResult = this.roomRepository.delete(room.id);
    if (roomRepoResult.isErr()) {
      return new Err(new RepositoryOperationError(roomRepoResult.unwrapErr()));
    }

    return new Ok(roomRepoResult.unwrap());
  }
}
