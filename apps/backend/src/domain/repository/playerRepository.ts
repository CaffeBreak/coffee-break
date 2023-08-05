import { Result } from "ts-results";

import { Player, PlayerId } from "../entity/player";
import { RoomId } from "../entity/room";

import { RepositoryError } from "@/error/repository";

export interface PlayerRepository {
  findById(id: PlayerId): Result<Player, RepositoryError>;
  findByRoomId(roomId: RoomId): Result<Player[], RepositoryError>;
  save(player: Player): Result<Player, RepositoryError>;
  delete(player: Player): Result<Player, RepositoryError>;
}
