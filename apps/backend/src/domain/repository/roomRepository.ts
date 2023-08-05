import { Result } from "ts-results";

import { Room, RoomId, RoomPassword } from "../entity/room";

import { RepositoryError } from "@/error/repository";

export interface RoomRepository {
  findById(id: RoomId): Result<Room, RepositoryError>;
  findByPassword(password: RoomPassword): Result<Room, RepositoryError>;
  save(room: Room): Result<Room, RepositoryError>;
  delete(room: Room): Result<Room, RepositoryError>;
}
