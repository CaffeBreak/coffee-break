import { Err, Ok, Result } from "ts-results";

import { RoomId } from "@/domain/entity/room";
import { RoomRepository } from "@/domain/repository/roomRepository";
import { UseCaseError } from "@/error/usecase";
import { RepositoryOperationError, RoomNotFoundError } from "@/error/usecase/room";

export const DeleteRoomUseCase =
  // prettier-ignore
  (roomRepository: RoomRepository) =>
    (id: RoomId): Result<void, UseCaseError> => {
    // 該当の部屋が存在しないなら消せない
      const roomResult = roomRepository.findById(id);
      if (roomResult.err) {
        return Err(new RoomNotFoundError());
      }
      const room = roomResult.unwrap();

      // 部屋を削除する
      const roomRepoResult = roomRepository.delete(room.id);
      if (roomRepoResult.err) {
        return Err(new RepositoryOperationError(roomRepoResult.val));
      }

      return Ok(roomRepoResult.unwrap());
    };
