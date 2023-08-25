import { Err, Ok, Result } from "ts-results";

import { PlayerId } from "@/domain/entity/player";
import { Room, RoomId, RoomPassword } from "@/domain/entity/room";
import { PlayerRepository } from "@/domain/repository/playerRepository";
import { RoomRepository } from "@/domain/repository/roomRepository";
import { UseCaseError } from "@/error/usecase";
import { AlreadyJoinedOtherRoomError, PlayerNotFoundError } from "@/error/usecase/player";
import {
  PasswordMismatchError,
  PlayerNameDuplicatedError,
  RoomNotFoundError,
} from "@/error/usecase/room";

export const JoinRoomUseCase =
  // prettier-ignore
  (roomRepository: RoomRepository, playerRepository: PlayerRepository) =>
    (roomId: RoomId, password: RoomPassword, playerId: PlayerId): Result<Room, UseCaseError> => {
      // 該当の部屋が存在しないなら参加できない
      const roomResult = roomRepository.findById(roomId);
      if (roomResult.err) {
        return Err(new RoomNotFoundError());
      }
      const room = roomResult.unwrap();

      // 該当のプレイヤーが存在しないなら参加できない
      const playerResult = playerRepository.findById(playerId);
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
      const playersInRoom = playerRepository.findByRoomId(room.id).unwrap();
      if (playersInRoom.some((p) => p.name === player.name)) {
        return Err(new PlayerNameDuplicatedError());
      }

      // 部屋に参加する
      room.join(player.id);
      player.joinRoom(room.id);
      playerRepository.save(player);
      roomRepository.save(room);

      return Ok(room);
    };
