import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject } from "tsyringe";

import type { IRoomRepository } from "@/domain/repository/interface/roomRepository";

import { RoomId } from "@/domain/entity/room";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";
import { RoomNotFoundError } from "@/error/usecase/room";

export class DeleteRoomUseCase {
  constructor(@inject("RoomRepository") private roomRepository: IRoomRepository) {}

  public execute(id: RoomId): Result<void, UseCaseError> {
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
