import { Result } from "@cffnpwr/result-ts";

import { RepositoryError } from "@/server/error/repository";

import { Player, PlayerId } from "../../entity/player";
import { RoomId } from "../../entity/room";

export interface IPlayerRepository {
  findById(id: PlayerId): Result<Player, RepositoryError>;
  findByRoomId(roomId: RoomId): Result<Player[], RepositoryError>;
  save(player: Player): Result<Player, RepositoryError>;
  delete(id: PlayerId): Result<void, RepositoryError>;
}
