import { container } from "tsyringe";
import { beforeAll, describe, expect, it } from "vitest";

import {
  Player,
  playerIdSchema,
  playerNameSchema,
  playerRoleSchema,
  playerStatusSchema,
} from "@/server/domain/entity/player";
import { roomIdSchema } from "@/server/domain/entity/room";
import { InMemoryPlayerRepository } from "@/server/domain/repository/inMemory/player";
import { DataNotFoundError } from "@/server/error/repository";

const inMemoryPlayerRepository = container.resolve(InMemoryPlayerRepository);

describe("findById", () => {
  const playerAlice = new Player(
    playerIdSchema.parse("9kvyrk2hq9"),
    playerNameSchema.parse("Alice"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
  );
  const playerBob = new Player(
    playerIdSchema.parse("9kvyrk2hqa"),
    playerNameSchema.parse("Bob"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
  );

  beforeAll(() => {
    inMemoryPlayerRepository.store = [playerAlice];
  });

  it("プレイヤーIDが一致するプレイヤーが存在する場合、そのプレイヤーを取得できる", () => {
    const result = inMemoryPlayerRepository.findById(playerAlice.id);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(playerAlice);
  });

  it("プレイヤーIDが一致するプレイヤーが存在しない場合、DataNotFoundErrorを返す", () => {
    const result = inMemoryPlayerRepository.findById(playerBob.id);

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
    roomId,
  );
  const playerBob = new Player(
    playerIdSchema.parse("9kvyrk2hqa"),
    playerNameSchema.parse("Bob"),
    playerRoleSchema.parse("WEREWOLF"),
    playerStatusSchema.parse("ALIVE"),
    roomId,
  );
  const playerCffnpwr = new Player(
    playerIdSchema.parse("9kvyrk2hqb"),
    playerNameSchema.parse("cffnpwr"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
  );
  const playerDiana = new Player(
    playerIdSchema.parse("9kvyrk2hqc"),
    playerNameSchema.parse("Diana"),
    playerRoleSchema.parse("VILLAGER"),
    playerStatusSchema.parse("ALIVE"),
    roomId,
  );

  beforeAll(() => {
    inMemoryPlayerRepository.store = [playerAlice, playerBob, playerCffnpwr, playerDiana];
  });

  it("部屋IDが一致する部屋に参加しているプレイヤーを配列で取得できる", () => {
    const result = inMemoryPlayerRepository.findByRoomId(roomId);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toStrictEqual([playerAlice, playerBob, playerDiana]);
  });

  it("部屋IDが一致する部屋に参加しているプレイヤーが存在しないとき、DataNotFoundErrorを返す", () => {
    const result = inMemoryPlayerRepository.findByRoomId(roomIdSchema.parse("9kzaa4d4g1"));

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(DataNotFoundError);
  });
});

describe("save", () => {
  const playerAlice = new Player(
    playerIdSchema.parse("9kvyrk2hq9"),
    playerNameSchema.parse("Alice"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
  );
  const playerBob = new Player(
    playerIdSchema.parse("9kvyrk2hqa"),
    playerNameSchema.parse("Bob"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
  );

  beforeAll(() => {
    inMemoryPlayerRepository.store = [playerAlice];
  });

  it("新たにプレイヤーを追加できる", () => {
    const result = inMemoryPlayerRepository.save(playerBob);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(playerBob);
    expect(inMemoryPlayerRepository.store).toStrictEqual([playerAlice, playerBob]);
  });

  it("既存プレイヤーのデータを更新できる", () => {
    const playerAliceDead = playerAlice;
    playerAliceDead.kill();

    const result = inMemoryPlayerRepository.save(playerAliceDead);

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
  );
  const playerBob = new Player(
    playerIdSchema.parse("9kvyrk2hqa"),
    playerNameSchema.parse("Bob"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
  );
  const playerCffnpwr = new Player(
    playerIdSchema.parse("9kvyrk2hqb"),
    playerNameSchema.parse("cffnpwr"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
  );

  beforeAll(() => {
    inMemoryPlayerRepository.store = [playerAlice, playerBob];
  });

  it("プレイヤーIDが一致するプレイヤーを削除できる", () => {
    const result = inMemoryPlayerRepository.delete(playerAlice.id);

    expect(result.isOk()).toBe(true);
    expect(inMemoryPlayerRepository.store).toStrictEqual([playerBob]);
  });

  it("プレイヤーIDが一致するプレイヤーが存在しない場合、DataNotFoundErrorを返す", () => {
    const result = inMemoryPlayerRepository.delete(playerCffnpwr.id);

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(DataNotFoundError);
  });
});
