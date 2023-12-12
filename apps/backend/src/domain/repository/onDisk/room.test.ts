import { PrismaClient } from "@prisma/client";
import { PrismockClient } from "prismock";
import { beforeAll, describe, expect, it } from "vitest";

import { OnDiskRoomRepository } from "./room";

import { Player, playerNameSchema } from "@/domain/entity/player";
import {
  Room,
  RoomPhase,
  roomIdSchema,
  roomPasswordSchema,
  roomPhaseSchema,
} from "@/domain/entity/room";
import { DataNotFoundError } from "@/error/repository";

const convertRoomToPrisma = (
  room: Room,
): {
  id: string;
  password: string;
  ownerId: string;
  phase: RoomPhase;
  day: number;
} => ({
  id: room.id,
  password: room.password,
  ownerId: room.ownerId,
  phase: room.phase,
  day: room.day,
});
const createPrismaMockWithInitialValue = async (rooms: Room[]): Promise<PrismaClient> => {
  const client = new PrismockClient();

  await client.player.createMany({
    data: rooms
      .map((room) =>
        room.players.map((player) => ({ id: player.id, name: player.name, joinedRoomId: room.id })),
      )
      .flat(),
  });
  await client.room.createMany({
    data: rooms.map((room) => convertRoomToPrisma(room)),
  });

  return client;
};

const playerAlice = Player.new(playerNameSchema.parse("Alice"));
const playerBob = Player.new(playerNameSchema.parse("Bob"));
const playerCffnpwr = Player.new(playerNameSchema.parse("cffnpwr"));

playerAlice.joinRoom(roomIdSchema.parse("9kzx7hf7w4"));
playerBob.joinRoom(roomIdSchema.parse("9kzx7hf7w5"));
playerCffnpwr.joinRoom(roomIdSchema.parse("9kzx7hf7w6"));

describe("findById", () => {
  let onDiskRoomRepository: OnDiskRoomRepository;

  const roomA = new Room(
    roomIdSchema.parse("9kzx7hf7w4"),
    roomPasswordSchema.parse("hogehoge"),
    playerAlice.id,
    roomPhaseSchema.parse("BEFORE_START"),
    [playerAlice],
    0,
  );
  const roomB = new Room(
    roomIdSchema.parse("9kzx7hf7w5"),
    roomPasswordSchema.parse("fugafuga"),
    playerBob.id,
    roomPhaseSchema.parse("BEFORE_START"),
    [playerBob],
    0,
  );

  beforeAll(async () => {
    onDiskRoomRepository = new OnDiskRoomRepository(
      await createPrismaMockWithInitialValue([roomA]),
    );
  });

  it("部屋IDが一致する部屋が存在する場合、その部屋を取得できる", async () => {
    const result = await onDiskRoomRepository.findById(roomA.id);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toStrictEqual(roomA);
  });

  it("部屋IDが一致する部屋が存在しない場合、DataNotFoundErrorを返す", async () => {
    const result = await onDiskRoomRepository.findById(roomB.id);

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(DataNotFoundError);
  });
});

describe("findByPassword", () => {
  let onDiskRoomRepository: OnDiskRoomRepository;

  const roomA = new Room(
    roomIdSchema.parse("9kzx7hf7w4"),
    roomPasswordSchema.parse("hogehoge"),
    playerAlice.id,
    roomPhaseSchema.parse("BEFORE_START"),
    [playerAlice],
    0,
  );
  const roomB = new Room(
    roomIdSchema.parse("9kzx7hf7w5"),
    roomPasswordSchema.parse("fugafuga"),
    playerBob.id,
    roomPhaseSchema.parse("BEFORE_START"),
    [playerBob],
    0,
  );

  beforeAll(async () => {
    onDiskRoomRepository = new OnDiskRoomRepository(
      await createPrismaMockWithInitialValue([roomA, roomB]),
    );
  });

  it("部屋の合言葉が一致する部屋が存在する場合、その部屋を取得できる", async () => {
    const result = await onDiskRoomRepository.findByPassword(roomPasswordSchema.parse("hogehoge"));

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toStrictEqual(roomA);
  });

  it("部屋の合言葉が一致する部屋が存在しない場合、DataNotFoundErrorを返す", async () => {
    const result = await onDiskRoomRepository.findByPassword(roomPasswordSchema.parse("piyopiyo"));

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(DataNotFoundError);
  });
});

describe("save", () => {
  let onDiskRoomRepository: OnDiskRoomRepository;

  const roomA = new Room(
    roomIdSchema.parse("9kzx7hf7w4"),
    roomPasswordSchema.parse("hogehoge"),
    playerAlice.id,
    roomPhaseSchema.parse("BEFORE_START"),
    [playerAlice],
    0,
  );
  const roomB = new Room(
    roomIdSchema.parse("9kzx7hf7w5"),
    roomPasswordSchema.parse("fugafuga"),
    playerBob.id,
    roomPhaseSchema.parse("BEFORE_START"),
    [playerBob],
    0,
  );

  beforeAll(async () => {
    onDiskRoomRepository = new OnDiskRoomRepository(
      await createPrismaMockWithInitialValue([roomA, roomB]),
    );
  });

  it("新たに部屋を追加できる", async () => {
    const result = await onDiskRoomRepository.save(roomB);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toStrictEqual(roomB);
  });

  it("既存の部屋のデータを更新できる", async () => {
    const roomAStarted = roomA;
    roomAStarted.nextPhase();

    const result = await onDiskRoomRepository.save(roomAStarted);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toStrictEqual(roomAStarted);
    // expect(onDiskRoomRepository.store).toStrictEqual([roomAFinished, roomB]);
  });
});

describe("delete", () => {
  let onDiskRoomRepository: OnDiskRoomRepository;

  const roomA = new Room(
    roomIdSchema.parse("9kzx7hf7w4"),
    roomPasswordSchema.parse("hogehoge"),
    playerAlice.id,
    roomPhaseSchema.parse("BEFORE_START"),
    [playerAlice],
    0,
  );
  const roomB = new Room(
    roomIdSchema.parse("9kzx7hf7w5"),
    roomPasswordSchema.parse("fugafuga"),
    playerBob.id,
    roomPhaseSchema.parse("BEFORE_START"),
    [playerBob],
    0,
  );
  const roomC = new Room(
    roomIdSchema.parse("9kzx7hf7w6"),
    roomPasswordSchema.parse("hogehoge"),
    playerCffnpwr.id,
    roomPhaseSchema.parse("BEFORE_START"),
    [playerCffnpwr],
    0,
  );

  beforeAll(async () => {
    onDiskRoomRepository = new OnDiskRoomRepository(
      await createPrismaMockWithInitialValue([roomA, roomB]),
    );
  });

  it("部屋IDが一致する部屋が存在する場合、その部屋を削除できる", async () => {
    const result = await onDiskRoomRepository.delete(roomA.id);

    expect(result.isOk()).toBe(true);
    // expect(onDiskRoomRepository.store).toStrictEqual([roomB]);
  });

  it("部屋IDが一致する部屋が存在しない場合、DataNotFoundErrorを返す", async () => {
    const result = await onDiskRoomRepository.delete(roomC.id);

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(DataNotFoundError);
  });
});
