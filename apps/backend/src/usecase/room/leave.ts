import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import type { IPlayerRepository } from "@/domain/repository/interface/player";
import type { IRoomRepository } from "@/domain/repository/interface/room";

import { PlayerId } from "@/domain/entity/player";
import { Room } from "@/domain/entity/room";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";
import { PlayerNotFoundError } from "@/error/usecase/player";
import { PlayerNotJoinedRoomError, RoomNotFoundError } from "@/error/usecase/room";

@injectable()
export class LeaveRoomUseCase {
  constructor(
    @inject("RoomRepository") private readonly roomRepository: IRoomRepository,
    @inject("PlayerRepository") private readonly playerRepository: IPlayerRepository,
  ) {}

  public async execute(playerId: PlayerId): Promise<Result<Room, UseCaseError>> {
    // 該当のプレイヤーが存在しないなら退出できない
    const playerResult = await this.playerRepository.findById(playerId);
    if (playerResult.isErr()) {
      return new Err(new PlayerNotFoundError());
    }
    const player = playerResult.unwrap();

    // 該当のプレイヤーが部屋に参加していない場合は退出できない
    if (!player.roomId) {
      return new Err(new PlayerNotJoinedRoomError());
    }

    // 該当の部屋が存在しないなら退出できない
    const roomResult = await this.roomRepository.findById(player.roomId);
    if (roomResult.isErr()) {
      player.leaveRoom();
      const result = await this.playerRepository.save(player);
      if (result.isErr()) {
        return new Err(new RepositoryOperationError(result.unwrapErr()));
      }

      return new Err(new RoomNotFoundError());
    }
    const room = roomResult.unwrap();

    // プレイヤーを退出させる
    player.leaveRoom();
    room.leave(player.id);
    const playerRepoResult = await this.playerRepository.save(player);
    const roomRepoResult = await this.roomRepository.save(room);
    if (playerRepoResult.isErr()) {
      return new Err(new RepositoryOperationError(playerRepoResult.unwrapErr()));
    }
    if (roomRepoResult.isErr()) {
      return new Err(new RepositoryOperationError(roomRepoResult.unwrapErr()));
    }

    return new Ok(roomRepoResult.unwrap());
  }
}
