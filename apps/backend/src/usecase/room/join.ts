import { Err, Ok, Result } from "ts-results";
import { inject } from "tsyringe";

import type { IPlayerRepository } from "@/domain/repository/interface/playerRepository";
import type { IRoomRepository } from "@/domain/repository/interface/roomRepository";

import { PlayerId } from "@/domain/entity/player";
import { Room, RoomId, RoomPassword } from "@/domain/entity/room";
import { UseCaseError } from "@/error/usecase/common";
import { AlreadyJoinedOtherRoomError, PlayerNotFoundError } from "@/error/usecase/player";
import {
  PasswordMismatchError,
  PlayerNameDuplicatedError,
  RepositoryOperationError,
  RoomNotFoundError,
} from "@/error/usecase/room";

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
    if (roomResult.err) {
      return Err(new RoomNotFoundError());
    }
    const room = roomResult.unwrap();

    // 該当のプレイヤーが存在しないなら参加できない
    const playerResult = this.playerRepository.findById(playerId);
    if (playerResult.err) {
      return Err(new PlayerNotFoundError());
    }
    const player = playerResult.unwrap();

    // 該当のプレイヤーが既に部屋に参加している場合は参加できない
    if (player.roomId) {
      return Err(new AlreadyJoinedOtherRoomError());
    }

    // 合言葉が一致しなければ参加できない
    if (!room.checkPassword(password)) {
      return Err(new PasswordMismatchError());
    }

    // 同じ名前のプレイヤーが同じ部屋に入ることはできない
    const playersInRoom = this.playerRepository.findByRoomId(room.id).unwrap();
    if (playersInRoom.some((p) => p.name === player.name)) {
      return Err(new PlayerNameDuplicatedError());
    }

    // 部屋に参加する
    room.join(player.id);
    player.joinRoom(room.id);
    const playerRepoResult = this.playerRepository.save(player);
    const roomRepoResult = this.roomRepository.save(room);
    if (playerRepoResult.err) {
      return Err(new RepositoryOperationError(playerRepoResult.val));
    }
    if (roomRepoResult.err) {
      return Err(new RepositoryOperationError(roomRepoResult.val));
    }

    return Ok(roomRepoResult.unwrap());
  }
}
