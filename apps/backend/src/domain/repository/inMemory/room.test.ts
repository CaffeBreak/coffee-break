import { container } from "tsyringe";
import { beforeAll, describe, expect, it } from "vitest";

import { InMemoryRoomRepository } from "./room";

import { playerIdSchema } from "@/domain/entity/player";
import { Room, roomIdSchema, roomPasswordSchema, roomStateSchema } from "@/domain/entity/room";
import { DataNotFoundError } from "@/error/repository";

const inMemoryRoomRepository = container.resolve(InMemoryRoomRepository);

describe("findById", () => {
  const roomA = new Room(
    roomIdSchema.parse("9kzx7hf7w4"),
    roomPasswordSchema.parse("hogehoge"),
    playerIdSchema.parse("9kvyrk2hq9"),
    roomStateSchema.parse("BEFORE_START"),
    [playerIdSchema.parse("9kvyrk2hq9")],
  );
  const roomB = new Room(
    roomIdSchema.parse("9kzx7hf7w5"),
    roomPasswordSchema.parse("fugafuga"),
    playerIdSchema.parse("9kvyrk2hqa"),
    roomStateSchema.parse("BEFORE_START"),
    [playerIdSchema.parse("9kvyrk2hqa")],
  );

  beforeAll(() => {
    inMemoryRoomRepository.store = [roomA];
  });

  it("部屋IDが一致する部屋が存在する場合、その部屋を取得できる", async () => {
    const result = await inMemoryRoomRepository.findById(roomA.id);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(roomA);
  });

  it("部屋IDが一致する部屋が存在しない場合、DataNotFoundErrorを返す", async () => {
    const result = await inMemoryRoomRepository.findById(roomB.id);

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(DataNotFoundError);
  });
});

describe("findByPassword", () => {
  const roomA = new Room(
    roomIdSchema.parse("9kzx7hf7w4"),
    roomPasswordSchema.parse("hogehoge"),
    playerIdSchema.parse("9kvyrk2hq9"),
    roomStateSchema.parse("BEFORE_START"),
    [playerIdSchema.parse("9kvyrk2hq9")],
  );
  const roomB = new Room(
    roomIdSchema.parse("9kzx7hf7w5"),
    roomPasswordSchema.parse("fugafuga"),
    playerIdSchema.parse("9kvyrk2hqa"),
    roomStateSchema.parse("BEFORE_START"),
    [playerIdSchema.parse("9kvyrk2hqa")],
  );

  beforeAll(() => {
    inMemoryRoomRepository.store = [roomA, roomB];
  });

  it("部屋の合言葉が一致する部屋が存在する場合、その部屋を取得できる", async () => {
    const result = await inMemoryRoomRepository.findByPassword(
      roomPasswordSchema.parse("hogehoge"),
    );

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(roomA);
  });

  it("部屋の合言葉が一致する部屋が存在しない場合、DataNotFoundErrorを返す", async () => {
    const result = await inMemoryRoomRepository.findByPassword(
      roomPasswordSchema.parse("piyopiyo"),
    );

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(DataNotFoundError);
  });
});

describe("save", () => {
  const roomA = new Room(
    roomIdSchema.parse("9kzx7hf7w4"),
    roomPasswordSchema.parse("hogehoge"),
    playerIdSchema.parse("9kvyrk2hq9"),
    roomStateSchema.parse("BEFORE_START"),
    [playerIdSchema.parse("9kvyrk2hq9")],
  );
  const roomB = new Room(
    roomIdSchema.parse("9kzx7hf7w5"),
    roomPasswordSchema.parse("fugafuga"),
    playerIdSchema.parse("9kvyrk2hqa"),
    roomStateSchema.parse("BEFORE_START"),
    [playerIdSchema.parse("9kvyrk2hqa")],
  );

  beforeAll(() => {
    inMemoryRoomRepository.store = [roomA];
  });

  it("新たに部屋を追加できる", async () => {
    const result = await inMemoryRoomRepository.save(roomB);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(roomB);
    expect(inMemoryRoomRepository.store).toStrictEqual([roomA, roomB]);
  });

  it("既存の部屋のデータを更新できる", async () => {
    const roomAFinished = roomA;
    roomAFinished.finishGame();

    const result = await inMemoryRoomRepository.save(roomAFinished);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(roomAFinished);
    expect(inMemoryRoomRepository.store).toStrictEqual([roomAFinished, roomB]);
  });
});

describe("delete", () => {
  const roomA = new Room(
    roomIdSchema.parse("9kzx7hf7w4"),
    roomPasswordSchema.parse("hogehoge"),
    playerIdSchema.parse("9kvyrk2hq9"),
    roomStateSchema.parse("BEFORE_START"),
    [playerIdSchema.parse("9kvyrk2hq9")],
  );
  const roomB = new Room(
    roomIdSchema.parse("9kzx7hf7w5"),
    roomPasswordSchema.parse("fugafuga"),
    playerIdSchema.parse("9kvyrk2hqa"),
    roomStateSchema.parse("BEFORE_START"),
    [playerIdSchema.parse("9kvyrk2hqa")],
  );
  const roomC = new Room(
    roomIdSchema.parse("9kzx7hf7w6"),
    roomPasswordSchema.parse("piyopiyo"),
    playerIdSchema.parse("9kvyrk2hqb"),
    roomStateSchema.parse("BEFORE_START"),
    [playerIdSchema.parse("9kvyrk2hqb")],
  );

  beforeAll(() => {
    inMemoryRoomRepository.store = [roomA, roomB];
  });

  it("部屋IDが一致する部屋が存在する場合、その部屋を削除できる", async () => {
    const result = await inMemoryRoomRepository.delete(roomA.id);

    expect(result.isOk()).toBe(true);
    expect(inMemoryRoomRepository.store).toStrictEqual([roomB]);
  });

  it("部屋IDが一致する部屋が存在しない場合、DataNotFoundErrorを返す", async () => {
    const result = await inMemoryRoomRepository.delete(roomC.id);

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(DataNotFoundError);
  });
});
