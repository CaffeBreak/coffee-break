import { container } from "tsyringe";
import { beforeAll, describe, expect, it } from "vitest";

import {
  Player,
  playerIdSchema,
  playerNameSchema,
  playerRoleSchema,
  playerStatusSchema,
} from "@/domain/entity/player";
import { roomIdSchema } from "@/domain/entity/room";
import { InMemoryPlayerRepository } from "@/domain/repository/inMemory/player";
import { DataNotFoundError } from "@/error/repository";

const inMemoryPlayerRepository = container.resolve(InMemoryPlayerRepository);

describe("findById", () => {
  const playerAlice = new Player(
    playerIdSchema.parse("9kvyrk2hq9"),
    playerNameSchema.parse("Alice"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
    false,
    [],
  );
  const playerBob = new Player(
    playerIdSchema.parse("9kvyrk2hqa"),
    playerNameSchema.parse("Bob"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
    false,
    [],
  );

  beforeAll(() => {
    inMemoryPlayerRepository.store = [playerAlice];
  });

  it("プレイヤーIDが一致するプレイヤーが存在する場合、そのプレイヤーを取得できる", async () => {
    const result = await inMemoryPlayerRepository.findById(playerAlice.id);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(playerAlice);
  });

  it("プレイヤーIDが一致するプレイヤーが存在しない場合、DataNotFoundErrorを返す", async () => {
    const result = await inMemoryPlayerRepository.findById(playerBob.id);

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(DataNotFoundError);
  });
});

describe("findByRoomId", () => {
  const roomId = roomIdSchema.parse("9kzaa4d4gn");
  const playerAlice = new Player(
    playerIdSchema.parse("9kvyrk2hq9"),
    playerNameSchema.parse("Alice"),
    playerRoleSchema.parse("VILLAGER"),
    playerStatusSchema.parse("ALIVE"),
    false,
    [],
    roomId,
  );
  const playerBob = new Player(
    playerIdSchema.parse("9kvyrk2hqa"),
    playerNameSchema.parse("Bob"),
    playerRoleSchema.parse("WEREWOLF"),
    playerStatusSchema.parse("ALIVE"),
    false,
    [],
    roomId,
  );
  const playerCffnpwr = new Player(
    playerIdSchema.parse("9kvyrk2hqb"),
    playerNameSchema.parse("cffnpwr"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
    false,
    [],
  );
  const playerDiana = new Player(
    playerIdSchema.parse("9kvyrk2hqc"),
    playerNameSchema.parse("Diana"),
    playerRoleSchema.parse("VILLAGER"),
    playerStatusSchema.parse("ALIVE"),
    false,
    [],
    roomId,
  );

  beforeAll(() => {
    inMemoryPlayerRepository.store = [playerAlice, playerBob, playerCffnpwr, playerDiana];
  });

  it("部屋IDが一致する部屋に参加しているプレイヤーを配列で取得できる", async () => {
    const result = await inMemoryPlayerRepository.findByRoomId(roomId);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toStrictEqual([playerAlice, playerBob, playerDiana]);
  });

  it("部屋IDが一致する部屋に参加しているプレイヤーが存在しないとき、空配列を返す", async () => {
    const result = await inMemoryPlayerRepository.findByRoomId(roomIdSchema.parse("9kzaa4d4g1"));

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toStrictEqual([]);
  });
});

describe("save", () => {
  const playerAlice = new Player(
    playerIdSchema.parse("9kvyrk2hq9"),
    playerNameSchema.parse("Alice"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
    false,
    [],
  );
  const playerBob = new Player(
    playerIdSchema.parse("9kvyrk2hqa"),
    playerNameSchema.parse("Bob"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
    false,
    [],
  );

  beforeAll(() => {
    inMemoryPlayerRepository.store = [playerAlice];
  });

  it("新たにプレイヤーを追加できる", async () => {
    const result = await inMemoryPlayerRepository.save(playerBob);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(playerBob);
    expect(inMemoryPlayerRepository.store).toStrictEqual([playerAlice, playerBob]);
  });

  it("既存プレイヤーのデータを更新できる", async () => {
    const playerAliceDead = playerAlice;
    playerAliceDead.kill();

    const result = await inMemoryPlayerRepository.save(playerAliceDead);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(playerAliceDead);
    expect(inMemoryPlayerRepository.store).toStrictEqual([playerAliceDead, playerBob]);
  });
});

describe("delete", () => {
  const playerAlice = new Player(
    playerIdSchema.parse("9kvyrk2hq9"),
    playerNameSchema.parse("Alice"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
    false,
    [],
  );
  const playerBob = new Player(
    playerIdSchema.parse("9kvyrk2hqa"),
    playerNameSchema.parse("Bob"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
    false,
    [],
  );
  const playerCffnpwr = new Player(
    playerIdSchema.parse("9kvyrk2hqb"),
    playerNameSchema.parse("cffnpwr"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
    false,
    [],
  );

  beforeAll(() => {
    inMemoryPlayerRepository.store = [playerAlice, playerBob];
  });

  it("プレイヤーIDが一致するプレイヤーを削除できる", async () => {
    const result = await inMemoryPlayerRepository.delete(playerAlice.id);

    expect(result.isOk()).toBe(true);
    expect(inMemoryPlayerRepository.store).toStrictEqual([playerBob]);
  });

  it("プレイヤーIDが一致するプレイヤーが存在しない場合、DataNotFoundErrorを返す", async () => {
    const result = await inMemoryPlayerRepository.delete(playerCffnpwr.id);

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(DataNotFoundError);
  });
});
