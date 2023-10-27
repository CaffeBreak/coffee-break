import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { singleton } from "tsyringe";

import { Room, RoomId, RoomPassword } from "@/server/domain/entity/room";
import { DataNotFoundError, RepositoryError } from "@/server/error/repository";
import { OkOrErr } from "@/server/misc/result";
import { voidType } from "@/server/misc/type";

import { IRoomRepository } from "../interface/room";

@singleton()
export class InMemoryRoomRepository implements IRoomRepository {
  public store: Room[] = [];

  findById(id: RoomId): Result<Room, RepositoryError> {
    return OkOrErr(
      this.store.find((room) => room.id === id),
      new DataNotFoundError(),
    );
  }
  findByPassword(password: RoomPassword): Result<Room, RepositoryError> {
    return OkOrErr(
      this.store.find((room) => room.checkPassword(password)),
      new DataNotFoundError(),
    );
  }
  save(room: Room): Result<Room, RepositoryError> {
    const index = this.store.findIndex((r) => r.id === room.id);
    if (index !== -1) {
      this.store[index] = room;

      return new Ok(this.store[index]);
    }

    const newIndex = this.store.push(room) - 1;

    return new Ok(this.store[newIndex]);
  }
  delete(id: RoomId): Result<void, RepositoryError> {
    const index = this.store.findIndex((r) => r.id === id);
    if (index === -1) {
      return new Err(new DataNotFoundError());
    }

    this.store.splice(index, 1);

    return new Ok(voidType);
  }
}
