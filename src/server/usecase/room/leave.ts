import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import { PlayerId } from "@/server/domain/entity/player";
import { Room } from "@/server/domain/entity/room";
import { RepositoryOperationError, UseCaseError } from "@/server/error/usecase/common";
import { PlayerNotFoundError } from "@/server/error/usecase/player";
import { PlayerNotJoinedRoomError, RoomNotFoundError } from "@/server/error/usecase/room";

import type { IPlayerRepository } from "@/server/domain/repository/interface/player";
import type { IRoomRepository } from "@/server/domain/repository/interface/room";

@injectable()
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
      return new Err(new PlayerNotJoinedRoomError());
    }

    // 該当の部屋が存在しないなら退出できない
    const roomResult = this.roomRepository.findById(player.roomId);
    if (roomResult.isErr()) {
      player.leaveRoom();
      const result = this.playerRepository.save(player);
      if (result.isErr()) {
        return new Err(new RepositoryOperationError(result.unwrapErr()));
      }

      return new Err(new RoomNotFoundError());
    }
    const room = roomResult.unwrap();

    // プレイヤーを退出させる
    player.leaveRoom();
    room.leave(player.id);
    const playerRepoResult = this.playerRepository.save(player);
    const roomRepoResult = this.roomRepository.save(room);
    if (playerRepoResult.isErr()) {
      return new Err(new RepositoryOperationError(playerRepoResult.unwrapErr()));
    }
    if (roomRepoResult.isErr()) {
      return new Err(new RepositoryOperationError(roomRepoResult.unwrapErr()));
    }

    return new Ok(roomRepoResult.unwrap());
  }
}
