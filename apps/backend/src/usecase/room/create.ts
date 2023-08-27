import { Err, Ok, Result } from "ts-results";

import { PlayerId } from "@/domain/entity/player";
import { Room, RoomPassword } from "@/domain/entity/room";
import { PlayerRepository } from "@/domain/repository/playerRepository";
import { RoomRepository } from "@/domain/repository/roomRepository";
import { UseCaseError } from "@/error/usecase";
import { AlreadyJoinedOtherRoomError } from "@/error/usecase/player";
import {
  RepositoryOperationError,
  RoomOwnerNotFoundError,
  RoomPasswordDuplicateError,
} from "@/error/usecase/room";

export const CreateRoomUseCase =
  // prettier-ignore
  (roomRepository: RoomRepository, playerRepository: PlayerRepository) =>
    (password: RoomPassword, ownerId: PlayerId): Result<Room, UseCaseError> => {
    // 同じ合言葉の部屋は作れない
      if (roomRepository.findByPassword(password).ok) {
        return Err(new RoomPasswordDuplicateError());
      }

      const ownerResult = playerRepository.findById(ownerId);
      // 部屋作成者が存在しない場合、部屋は作れない
      if (ownerResult.err) {
        return Err(new RoomOwnerNotFoundError());
      }

      // 部屋作成者がすでに他の部屋に参加している場合は部屋を作成できない
      if (ownerResult.unwrap().roomId) {
        return Err(new AlreadyJoinedOtherRoomError());
      }
      const newRoom = Room.new(password, ownerId);

      const roomResult = roomRepository.save(newRoom);
      if (roomResult.err) {
        return Err(new RepositoryOperationError(roomResult.val));
      }

      return Ok(roomResult.unwrap());
    };
