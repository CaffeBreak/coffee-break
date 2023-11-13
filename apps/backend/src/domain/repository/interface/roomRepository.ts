import { Result } from "@cffnpwr/ts-results";

import { Room, RoomId, RoomPassword } from "@/domain/entity/room";
import { RepositoryError } from "@/error/repository";

export interface IRoomRepository {
  findById(id: RoomId): Promise<Result<Room, RepositoryError>>;
  findByPassword(password: RoomPassword): Promise<Result<Room, RepositoryError>>;
  save(room: Room): Promise<Result<Room, RepositoryError>>;
  delete(id: RoomId): Promise<Result<void, RepositoryError>>;
}
