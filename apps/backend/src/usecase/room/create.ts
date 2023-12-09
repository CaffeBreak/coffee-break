import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import type { IPlayerRepository } from "@/domain/repository/interface/player";
import type { IRoomRepository } from "@/domain/repository/interface/room";

import { PlayerId } from "@/domain/entity/player";
import { Room, RoomPassword } from "@/domain/entity/room";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";
import { AlreadyJoinedOtherRoomError } from "@/error/usecase/player";
import { RoomOwnerNotFoundError, RoomPasswordDuplicateError } from "@/error/usecase/room";

@injectable()
export class CreateRoomUseCase {
  constructor(
    @inject("RoomRepository") private readonly roomRepository: IRoomRepository,
    @inject("PlayerRepository") private readonly playerRepository: IPlayerRepository,
  ) {}

  public async execute(
    password: RoomPassword,
    ownerId: PlayerId,
  ): Promise<Result<Room, UseCaseError>> {
    // 同じ合言葉の部屋は作れない
    if ((await this.roomRepository.findByPassword(password)).isOk()) {
      return new Err(new RoomPasswordDuplicateError());
    }

    const ownerResult = await this.playerRepository.findById(ownerId);
    // 部屋作成者が存在しない場合、部屋は作れない
    if (ownerResult.isErr()) {
      return new Err(new RoomOwnerNotFoundError());
    }
    const owner = ownerResult.unwrap();

    // 部屋作成者がすでに他の部屋に参加している場合は部屋を作成できない
    if (ownerResult.unwrap().roomId) {
      return new Err(new AlreadyJoinedOtherRoomError());
    }
    const newRoom = Room.new(password, owner);

    const roomResult = await this.roomRepository.save(newRoom);
    if (roomResult.isErr()) {
      return new Err(new RepositoryOperationError(roomResult.unwrapErr()));
    }

    // 部屋作成者は即時に部屋に参加する
    owner.joinRoom(roomResult.unwrap().id);
    const playerResult = await this.playerRepository.save(owner);
    if (playerResult.isErr()) {
      return new Err(new RepositoryOperationError(playerResult.unwrapErr()));
    }

    return new Ok(roomResult.unwrap());
  }
}
