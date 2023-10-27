import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import { PlayerId } from "@/server/domain/entity/player";
import { Room, RoomId, RoomPassword } from "@/server/domain/entity/room";
import { RepositoryOperationError, UseCaseError } from "@/server/error/usecase/common";
import { AlreadyJoinedOtherRoomError, PlayerNotFoundError } from "@/server/error/usecase/player";
import {
  PasswordMismatchError,
  PlayerNameDuplicatedError,
  RoomNotFoundError,
} from "@/server/error/usecase/room";

import type { IPlayerRepository } from "@/server/domain/repository/interface/player";
import type { IRoomRepository } from "@/server/domain/repository/interface/room";

@injectable()
export class JoinRoomUseCase {
  constructor(
    @inject("RoomRepository") private roomRepository: IRoomRepository,
    @inject("PlayerRepository") private playerRepository: IPlayerRepository,
  ) {}

  public execute(
    roomId: RoomId,
    password: RoomPassword,
    playerId: PlayerId,
  ): Result<Room, UseCaseError> {
    // 該当の部屋が存在しないなら参加できない
    const roomResult = this.roomRepository.findById(roomId);
    if (roomResult.isErr()) {
      return new Err(new RoomNotFoundError());
    }
    const room = roomResult.unwrap();

    // 該当のプレイヤーが存在しないなら参加できない
    const playerResult = this.playerRepository.findById(playerId);
    if (playerResult.isErr()) {
      return new Err(new PlayerNotFoundError());
    }
    const player = playerResult.unwrap();

    // 該当のプレイヤーが既に部屋に参加している場合は参加できない
    if (player.roomId) {
      return new Err(new AlreadyJoinedOtherRoomError());
    }

    // 合言葉が一致しなければ参加できない
    if (!room.checkPassword(password)) {
      return new Err(new PasswordMismatchError());
    }

    // 同じ名前のプレイヤーが同じ部屋に入ることはできない
    const playersInRoom = this.playerRepository.findByRoomId(room.id).unwrap();
    if (playersInRoom.some((p) => p.name === player.name)) {
      return new Err(new PlayerNameDuplicatedError());
    }

    // 部屋に参加する
    room.join(player.id);
    player.joinRoom(room.id);
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