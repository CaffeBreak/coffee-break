import { Result } from "@cffnpwr/result-ts";

import { Player, PlayerId } from "../../entity/player";
import { RoomId } from "../../entity/room";

import { RepositoryError } from "@/error/repository";

export interface IPlayerRepository {
  findById(id: PlayerId): Result<Player, RepositoryError>;
  findByRoomId(roomId: RoomId): Result<Player[], RepositoryError>;
  save(player: Player): Result<Player, RepositoryError>;
  delete(id: PlayerId): Result<void, RepositoryError>;
}
