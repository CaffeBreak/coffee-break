import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import type { IPlayerRepository } from "@/domain/repository/interface/player";
import type { IRoomRepository } from "@/domain/repository/interface/room";

import { PlayerId } from "@/domain/entity/player";
import { Room, RoomPassword } from "@/domain/entity/room";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";
import { AlreadyJoinedOtherRoomError, PlayerNotFoundError } from "@/error/usecase/player";
import {
  PlayerNameDuplicatedError,
  RoomNotFoundError,
} from "@/error/usecase/room";

@injectable()
export class JoinRoomUseCase {
  constructor(
    @inject("RoomRepository") private readonly roomRepository: IRoomRepository,
    @inject("PlayerRepository") private readonly playerRepository: IPlayerRepository,
  ) {}

  public async execute(
    password: RoomPassword,
    playerId: PlayerId,
  ): Promise<Result<Room, UseCaseError>> {
    // 該当の部屋が存在しないなら参加できない
    const roomResult = await this.roomRepository.findByPassword(password);
    if (roomResult.isErr()) {
      return new Err(new RoomNotFoundError());
    }
    const room = roomResult.unwrap();

    // 該当のプレイヤーが存在しないなら参加できない
    const playerResult = await this.playerRepository.findById(playerId);
    if (playerResult.isErr()) {
      return new Err(new PlayerNotFoundError());
    }
    const player = playerResult.unwrap();

    // 該当のプレイヤーが既に部屋に参加している場合は参加できない
    if (player.roomId) {
      return new Err(new AlreadyJoinedOtherRoomError());
    }

    // 同じ名前のプレイヤーが同じ部屋に入ることはできない
    const playersInRoom = (await this.playerRepository.findByRoomId(room.id)).unwrap();
    if (playersInRoom.some((p) => p.name === player.name)) {
      return new Err(new PlayerNameDuplicatedError());
    }

    // 部屋に参加する
    room.join(player.id);
    player.joinRoom(room.id);
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
