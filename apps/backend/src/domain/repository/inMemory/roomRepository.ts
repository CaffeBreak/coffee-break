import { Err, Ok, Result } from "@cffnpwr/ts-results";
import { singleton } from "tsyringe";

import { IRoomRepository } from "../interface/roomRepository";

import { Room, RoomId, RoomPassword } from "@/domain/entity/room";
import { DataNotFoundError, RepositoryError } from "@/error/repository";
import { OkOrErr } from "@/misc/result";
import { voidType } from "@/misc/type";

const store: Room[] = [];

@singleton()
export class InMemoryRoomRepository implements IRoomRepository {
  //awaitの敗北
  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: RoomId): Promise<Result<Room, RepositoryError>> {
    return OkOrErr(
      store.find((room) => room.id === id),
      new DataNotFoundError(),
    );
  }
  //awaitの敗北
  // eslint-disable-next-line @typescript-eslint/require-await
  async findByPassword(password: RoomPassword): Promise<Result<Room, RepositoryError>> {
    return OkOrErr(
      store.find((room) => room.checkPassword(password)),
      new DataNotFoundError(),
    );
  }

  //awaitの敗北
  // eslint-disable-next-line @typescript-eslint/require-await
  async save(room: Room): Promise<Result<Room, RepositoryError>> {
    const index = store.findIndex((r) => r.id === room.id);
    if (index !== -1) {
      store[index] = room;

      return Ok(store[index]);
    }

    const newIndex = store.push(room);

    return Ok(store[newIndex]);
  }

  //awaitの敗北
  // eslint-disable-next-line @typescript-eslint/require-await
  async delete(id: RoomId): Promise<Result<void, RepositoryError>> {
    const index = store.findIndex((r) => r.id === id);
    if (index === -1) {
      return Err(new DataNotFoundError());
    }

    store.splice(index, 1);

    return Ok(voidType);
  }
}
