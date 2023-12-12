import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { singleton } from "tsyringe";

import { IPlayerRepository } from "../interface/player";

import { Player, PlayerId } from "@/domain/entity/player";
import { RoomId } from "@/domain/entity/room";
import { DataNotFoundError, RepositoryError } from "@/error/repository";
import { OkOrErr } from "@/misc/result";
import { voidType } from "@/misc/type";

@singleton()
export class InMemoryPlayerRepository implements IPlayerRepository {
  public store: Player[] = [];

  findById(id: PlayerId): Promise<Result<Player, RepositoryError>> {
    return new Promise((resolve) => {
      resolve(
        OkOrErr(
          this.store.find((player) => player.id === id),
          new DataNotFoundError(),
        ),
      );
    });
  }

  findByRoomId(roomId: RoomId): Promise<Result<Player[], RepositoryError>> {
    return new Promise((resolve) => {
      resolve(
        OkOrErr(
          this.store.filter((player) => player.roomId === roomId),
          new DataNotFoundError(),
        ),
      );
    });
  }

  save(player: Player): Promise<Result<Player, RepositoryError>> {
    const index = this.store.findIndex((p) => p.id === player.id);
    if (index !== -1) {
      this.store[index] = player;

      return new Promise((resolve) => {
        resolve(new Ok(this.store[index]));
      });
    }

    const newIndex = this.store.push(player) - 1;

    return new Promise((resolve) => {
      resolve(new Ok(this.store[newIndex]));
    });
  }

  saveMany(players: Player[]): Promise<Result<Player[], RepositoryError>> {
    return new Promise((resolve) =>
      resolve(
        new Ok(
          players.map((player) => {
            const index = this.store.findIndex((p) => p.id === player.id);
            if (index !== -1) {
              this.store[index] = player;

              return this.store[index];
            }

            const newIndex = this.store.push(player) - 1;

            return this.store[newIndex];
          }),
        ),
      ),
    );
  }

  delete(id: PlayerId): Promise<Result<void, RepositoryError>> {
    const index = this.store.findIndex((p) => p.id === id);
    if (index === -1) {
      return new Promise((resolve) => {
        resolve(new Err(new DataNotFoundError()));
      });
    }

    this.store.splice(index, 1);

    return new Promise((resolve) => {
      resolve(new Ok(voidType));
    });
  }
}
