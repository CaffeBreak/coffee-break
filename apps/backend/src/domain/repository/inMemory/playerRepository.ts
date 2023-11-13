import { Err, Ok, Result } from "@cffnpwr/ts-results";
import { singleton } from "tsyringe";

import { IPlayerRepository } from "./../interface/playerRepository";

import { Player, PlayerId } from "@/domain/entity/player";
import { RoomId } from "@/domain/entity/room";
import { DataNotFoundError, RepositoryError } from "@/error/repository";
import { OkOrErr } from "@/misc/result";
import { voidType } from "@/misc/type";

const store: Player[] = [];

@singleton()
export class InMemoryPlayerRepository implements IPlayerRepository {
  //awaitの敗北
  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: PlayerId): Promise<Result<Player, RepositoryError>> {
    return OkOrErr(
      store.find((player) => player.id === id),
      new DataNotFoundError(),
    );
  }
  //awaitの敗北
  // eslint-disable-next-line @typescript-eslint/require-await
  async findByRoomId(roomId: RoomId): Promise<Result<Player[], RepositoryError>> {
    return OkOrErr(
      store.filter((player) => player.roomId === roomId),
      new DataNotFoundError(),
    );
  }

  //awaitの敗北
  // eslint-disable-next-line @typescript-eslint/require-await
  async save(player: Player): Promise<Result<Player, RepositoryError>> {
    const index = store.findIndex((p) => p.id === player.id);
    if (index !== -1) {
      store[index] = player;

      return Ok(store[index]);
    }

    const newIndex = store.push(player);

    return Ok(store[newIndex]);
  }

  //awaitの敗北
  // eslint-disable-next-line @typescript-eslint/require-await
  async delete(id: PlayerId): Promise<Result<void, RepositoryError>> {
    const index = store.findIndex((p) => p.id === id);
    if (index === -1) {
      return Err(new DataNotFoundError());
    }

    store.splice(index, 1);

    return Ok(voidType);
  }
}
