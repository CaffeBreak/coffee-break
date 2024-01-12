import { container } from "tsyringe";
import { beforeAll, expect, it } from "vitest";

import { CreateRoomUseCase } from "./create";

import {
  Player,
  playerIdSchema,
  playerNameSchema,
  playerRoleSchema,
  playerStatusSchema,
} from "@/domain/entity/player";
import { Room, roomIdSchema, roomPasswordSchema, roomPhaseSchema } from "@/domain/entity/room";
import { InMemoryPlayerRepository } from "@/domain/repository/inMemory/player";
import { InMemoryRoomRepository } from "@/domain/repository/inMemory/room";
import { AlreadyJoinedOtherRoomError } from "@/error/usecase/player";
import { RoomOwnerNotFoundError, RoomPasswordDuplicateError } from "@/error/usecase/room";

const playerRepository = container.resolve<InMemoryPlayerRepository>("PlayerRepository");
const roomRepository = container.resolve<InMemoryRoomRepository>("RoomRepository");

const createRoomUseCase = container.resolve(CreateRoomUseCase);

const playerAlice = new Player(
  playerIdSchema.parse("9kvyrk2hq9"),
  playerNameSchema.parse("Alice"),
  playerRoleSchema.parse("PENDING"),
  playerStatusSchema.parse("ALIVE"),
  false,
  [],
  roomIdSchema.parse("9kzx7hf7w4"),
);
const playerBob = new Player(
  playerIdSchema.parse("9kvyrk2hqa"),
  playerNameSchema.parse("Bob"),
  playerRoleSchema.parse("PENDING"),
  playerStatusSchema.parse("ALIVE"),
  false,
  [],
);

const roomA = new Room(
  roomIdSchema.parse("9kzx7hf7w4"),
  roomPasswordSchema.parse("hogehoge"),
  playerAlice.id,
  roomPhaseSchema.parse("BEFORE_START"),
  [playerAlice],
  0,
);

beforeAll(() => {
  playerRepository.store = [playerAlice, playerBob];
  roomRepository.store = [roomA];
});

it("新しい部屋を作成できる", async () => {
  const result = await createRoomUseCase.execute(
    roomPasswordSchema.parse("fugafuga"),
    playerBob.id,
  );

  expect(result.isOk()).toBe(true);
  expect(result.unwrap().ownerId).toBe(playerBob.id);
  expect(result.unwrap().id).toBe((await playerRepository.findById(playerBob.id)).unwrap().roomId);
});

it("同じ合言葉の部屋は作れず、RoomPasswordDuplicateErrorを返す", async () => {
  const result = await createRoomUseCase.execute(
    roomPasswordSchema.parse("hogehoge"),
    playerAlice.id,
  );

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(RoomPasswordDuplicateError);
});

it("部屋作成者が存在しない場合、部屋は作れず、RoomOwnerNotFoundErrorを返す", async () => {
  const result = await createRoomUseCase.execute(
    roomPasswordSchema.parse("cffnpwr"),
    playerIdSchema.parse("9kvyrk2hqb"),
  );

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(RoomOwnerNotFoundError);
});

it("部屋作成者がすでに他の部屋に参加している場合、部屋は作れず、AlreadyJoinedOtherRoomErrorを返す", async () => {
  const result = await createRoomUseCase.execute(roomPasswordSchema.parse("alice"), playerAlice.id);

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(AlreadyJoinedOtherRoomError);
});
