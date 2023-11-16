import { Result } from "@cffnpwr/result-ts";

import { Player, PlayerId } from "../../entity/player";
import { RoomId } from "../../entity/room";

import { RepositoryError } from "@/error/repository";

export interface IPlayerRepository {
  findById(id: PlayerId): Promise<Result<Player, RepositoryError>>;
  findByRoomId(roomId: RoomId): Promise<Result<Player[], RepositoryError>>;
  save(player: Player): Promise<Result<Player, RepositoryError>>;
  delete(id: PlayerId): Promise<Result<void, RepositoryError>>;
}
