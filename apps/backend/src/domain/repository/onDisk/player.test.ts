import { PlayerRole, PrismaClient, RoomPhase } from "@prisma/client";
import { PrismockClient } from "prismock";
import { beforeAll, describe, expect, it } from "vitest";

import { OnDiskPlayerRepository } from "./player";

import {
  Player,
  playerIdSchema,
  playerNameSchema,
  playerRoleSchema,
  playerStatusSchema,
} from "@/domain/entity/player";
import { roomIdSchema } from "@/domain/entity/room";
import { DataNotFoundError } from "@/error/repository";

const convertPlayerToPrisma = (
  player: Player,
): {
  id: string;
  name: string;
  isDead: boolean;
  joinedRoomId?: string;
  role?: PlayerRole;
} => ({
  id: player.id,
  name: player.name,
  isDead: player.status === "DEAD",
  joinedRoomId: player.roomId,
  role: player.role,
});
const createPrismaMockWithInitialValue = async (players: Player[]): Promise<PrismaClient> => {
  const client = new PrismockClient();

  await client.room.createMany({
    data: players
      .filter((player) => player.roomId)
      .map((player) => ({
        id: player.roomId as string,
        password: "password",
        ownerId: "9999999999",
        phase: RoomPhase.BEFORE_START,
        day: 0,
      }))
      .flat(),
  });
  await client.player.createMany({
    data: players.map((player) => convertPlayerToPrisma(player)),
  });

  return client;
};

describe("findById", () => {
  let onDiskPlayerRepository: OnDiskPlayerRepository;

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

  beforeAll(async () => {
    onDiskPlayerRepository = new OnDiskPlayerRepository(
      await createPrismaMockWithInitialValue([playerAlice]),
    );
  });

  it("プレイヤーIDが一致するプレイヤーが存在する場合、そのプレイヤーを取得できる", async () => {
    const result = await onDiskPlayerRepository.findById(playerAlice.id);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toStrictEqual(playerAlice);
  });

  it("プレイヤーIDが一致するプレイヤーが存在しない場合、DataNotFoundErrorを返す", async () => {
    const result = await onDiskPlayerRepository.findById(playerBob.id);

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(DataNotFoundError);
  });
});

describe("findByRoomId", () => {
  let onDiskPlayerRepository: OnDiskPlayerRepository;

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

  beforeAll(async () => {
    onDiskPlayerRepository = new OnDiskPlayerRepository(
      await createPrismaMockWithInitialValue([playerAlice, playerBob, playerCffnpwr, playerDiana]),
    );
  });

  it("部屋IDが一致する部屋に参加しているプレイヤーを配列で取得できる", async () => {
    const result = await onDiskPlayerRepository.findByRoomId(roomId);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toStrictEqual([playerAlice, playerBob, playerDiana]);
  });

  it("部屋IDが一致する部屋に参加しているプレイヤーが存在しないとき、空配列を返す", async () => {
    const result = await onDiskPlayerRepository.findByRoomId(roomIdSchema.parse("9kzaa4d4g1"));

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toStrictEqual([]);
  });
});

describe("save", () => {
  let onDiskPlayerRepository: OnDiskPlayerRepository;

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

  beforeAll(async () => {
    onDiskPlayerRepository = new OnDiskPlayerRepository(
      await createPrismaMockWithInitialValue([playerAlice]),
    );
  });

  it("新たにプレイヤーを追加できる", async () => {
    const result = await onDiskPlayerRepository.save(playerBob);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toStrictEqual(playerBob);
    // expect(onDiskPlayerRepository.store).toStrictEqual([playerAlice, playerBob]);
  });

  it("既存プレイヤーのデータを更新できる", async () => {
    const playerAliceDead = playerAlice;
    playerAliceDead.kill();

    const result = await onDiskPlayerRepository.save(playerAliceDead);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toStrictEqual(playerAliceDead);
    // expect(inMemoryPlayerRepository.store).toStrictEqual([playerAliceDead, playerBob]);
  });
});

describe("delete", () => {
  let onDiskPlayerRepository: OnDiskPlayerRepository;

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

  beforeAll(async () => {
    onDiskPlayerRepository = new OnDiskPlayerRepository(
      await createPrismaMockWithInitialValue([playerAlice, playerBob]),
    );
  });

  it("プレイヤーIDが一致するプレイヤーを削除できる", async () => {
    const result = await onDiskPlayerRepository.delete(playerAlice.id);

    expect(result.isOk()).toBe(true);
    // expect(inMemoryPlayerRepository.store).toStrictEqual([playerBob]);
  });

  it("プレイヤーIDが一致するプレイヤーが存在しない場合、DataNotFoundErrorを返す", async () => {
    const result = await onDiskPlayerRepository.delete(playerCffnpwr.id);

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(DataNotFoundError);
  });
});
