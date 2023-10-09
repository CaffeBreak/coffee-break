import { Result } from "ts-results";

import { Room, RoomId, RoomPassword } from "@/domain/entity/room";
import { RepositoryError } from "@/error/repository";

export interface IRoomRepository {
  findById(id: RoomId): Result<Room, RepositoryError>;
  findByPassword(password: RoomPassword): Result<Room, RepositoryError>;
  save(room: Room): Result<Room, RepositoryError>;
  delete(id: RoomId): Result<void, RepositoryError>;
}
