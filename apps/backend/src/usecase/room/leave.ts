import { Err, Ok, Result } from "ts-results";

import { PlayerId } from "@/domain/entity/player";
import { Room } from "@/domain/entity/room";
import { PlayerRepository } from "@/domain/repository/playerRepository";
import { RoomRepository } from "@/domain/repository/roomRepository";
import { UseCaseError } from "@/error/usecase";
import { AlreadyJoinedOtherRoomError, PlayerNotFoundError } from "@/error/usecase/player";
import { RepositoryOperationError, RoomNotFoundError } from "@/error/usecase/room";

export const LeaveRoomUseCase =
  // prettier-ignore
  (roomRepository: RoomRepository, playerRepository: PlayerRepository) =>
    (playerId: PlayerId): Result<Room, UseCaseError> => {
      // 該当のプレイヤーが存在しないなら退出できない
      const playerResult = playerRepository.findById(playerId);
      if (playerResult.err) {
        return Err(new PlayerNotFoundError());
      }
      const player = playerResult.unwrap();

      // 該当のプレイヤーが部屋に参加していない場合は退出できない
      if (!player.roomId) {
        return Err(new AlreadyJoinedOtherRoomError());
      }

      // 該当の部屋が存在しないなら退出できない
      const roomResult = roomRepository.findById(player.roomId);
      if (roomResult.err) {
        return Err(new RoomNotFoundError());
      }
      const room = roomResult.unwrap();

      // プレイヤーを退出させる
      room.leave(player.id);
      const roomRepoResult = roomRepository.save(room);
      if (roomRepoResult.err) {
        return Err(new RepositoryOperationError(roomRepoResult.val));
      }

      return Ok(roomRepoResult.unwrap());
    };
