import { Result } from "@cffnpwr/result-ts";

import { Room, RoomId, RoomPassword } from "@/server/domain/entity/room";
import { RepositoryError } from "@/server/error/repository";

export interface IRoomRepository {
  findById(id: RoomId): Result<Room, RepositoryError>;
  findByPassword(password: RoomPassword): Result<Room, RepositoryError>;
  save(room: Room): Result<Room, RepositoryError>;
  delete(id: RoomId): Result<void, RepositoryError>;
}
