import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import type { IRoomRepository } from "@/domain/repository/interface/room";

import { Room, RoomId } from "@/domain/entity/room";
import { DataNotFoundError } from "@/error/repository";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";
import { RoomNotFoundError } from "@/error/usecase/room";

@injectable()
export class GetRoomUseCase {
  constructor(@inject("RoomRepository") private readonly roomRepository: IRoomRepository) {}

  public async execute(roomId: RoomId): Promise<Result<Room, UseCaseError>> {
    // 該当の部屋が存在しないなら無いよ
    const roomResult = await this.roomRepository.findById(roomId);
    if (roomResult.isErr()) {
      if (roomResult.unwrapErr() instanceof DataNotFoundError) {
        return new Err(new RoomNotFoundError());
      } else {
        return new Err(new RepositoryOperationError(roomResult.unwrapErr()));
      }
    }
    const room = roomResult.unwrap();

    return new Ok(room);
  }
}
