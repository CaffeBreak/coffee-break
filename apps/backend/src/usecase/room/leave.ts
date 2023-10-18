import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject } from "tsyringe";

import type { IPlayerRepository } from "@/domain/repository/interface/playerRepository";
import type { IRoomRepository } from "@/domain/repository/interface/roomRepository";

import { PlayerId } from "@/domain/entity/player";
import { Room } from "@/domain/entity/room";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";
import { AlreadyJoinedOtherRoomError, PlayerNotFoundError } from "@/error/usecase/player";
import { RoomNotFoundError } from "@/error/usecase/room";

export class LeaveRoomUseCase {
  constructor(
    @inject("RoomRepository") private roomRepository: IRoomRepository,
    @inject("PlayerRepository") private playerRepository: IPlayerRepository,
  ) {}

  public execute(playerId: PlayerId): Result<Room, UseCaseError> {
    // 該当のプレイヤーが存在しないなら退出できない
    const playerResult = this.playerRepository.findById(playerId);
    if (playerResult.isErr()) {
      return new Err(new PlayerNotFoundError());
    }
    const player = playerResult.unwrap();

    // 該当のプレイヤーが部屋に参加していない場合は退出できない
    if (!player.roomId) {
      return new Err(new AlreadyJoinedOtherRoomError());
    }

    // 該当の部屋が存在しないなら退出できない
    const roomResult = this.roomRepository.findById(player.roomId);
    if (roomResult.isErr()) {
      return new Err(new RoomNotFoundError());
    }
    const room = roomResult.unwrap();

    // プレイヤーを退出させる
    room.leave(player.id);
    const roomRepoResult = this.roomRepository.save(room);
    if (roomRepoResult.isErr()) {
      return new Err(new RepositoryOperationError(roomRepoResult.unwrapErr()));
    }

    return new Ok(roomRepoResult.unwrap());
  }
}
