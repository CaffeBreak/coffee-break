import { container } from "tsyringe";
import { beforeAll, expect, it } from "vitest";

import {
  Player,
  playerIdSchema,
  playerNameSchema,
  playerRoleSchema,
  playerStatusSchema,
} from "@/server/domain/entity/player";
import {
  Room,
  roomIdSchema,
  roomPasswordSchema,
  roomStateSchema,
} from "@/server/domain/entity/room";
import { InMemoryPlayerRepository } from "@/server/domain/repository/inMemory/player";
import { InMemoryRoomRepository } from "@/server/domain/repository/inMemory/room";
import { AlreadyJoinedOtherRoomError } from "@/server/error/usecase/player";
import { RoomOwnerNotFoundError, RoomPasswordDuplicateError } from "@/server/error/usecase/room";

import { CreateRoomUseCase } from "./create";

const playerRepository = container.resolve<InMemoryPlayerRepository>("PlayerRepository");
const roomRepository = container.resolve<InMemoryRoomRepository>("RoomRepository");

const createRoomUseCase = container.resolve(CreateRoomUseCase);

const playerAlice = new Player(
  playerIdSchema.parse("9kvyrk2hq9"),
  playerNameSchema.parse("Alice"),
  playerRoleSchema.parse("PENDING"),
  playerStatusSchema.parse("ALIVE"),
  roomIdSchema.parse("9kzx7hf7w4"),
);
const playerBob = new Player(
  playerIdSchema.parse("9kvyrk2hqa"),
  playerNameSchema.parse("Bob"),
  playerRoleSchema.parse("PENDING"),
  playerStatusSchema.parse("ALIVE"),
);

const roomA = new Room(
  roomIdSchema.parse("9kzx7hf7w4"),
  roomPasswordSchema.parse("hogehoge"),
  playerIdSchema.parse("9kvyrk2hq9"),
  roomStateSchema.parse("BEFORE_START"),
  [playerIdSchema.parse("9kvyrk2hq9")],
);

beforeAll(() => {
  playerRepository.store = [playerAlice, playerBob];
  roomRepository.store = [roomA];
});

it("新しい部屋を作成できる", () => {
  const result = createRoomUseCase.execute(roomPasswordSchema.parse("fugafuga"), playerBob.id);

  expect(result.isOk()).toBe(true);
  expect(result.unwrap().ownerId).toBe(playerBob.id);
  expect(result.unwrap().id).toBe(playerRepository.findById(playerBob.id).unwrap().roomId);
});

it("同じ合言葉の部屋は作れず、RoomPasswordDuplicateErrorを返す", () => {
  const result = createRoomUseCase.execute(roomPasswordSchema.parse("hogehoge"), playerAlice.id);

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(RoomPasswordDuplicateError);
});

it("部屋作成者が存在しない場合、部屋は作れず、RoomOwnerNotFoundErrorを返す", () => {
  const result = createRoomUseCase.execute(
    roomPasswordSchema.parse("cffnpwr"),
    playerIdSchema.parse("9kvyrk2hqb"),
  );

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(RoomOwnerNotFoundError);
});

it("部屋作成者がすでに他の部屋に参加している場合、部屋は作れず、AlreadyJoinedOtherRoomErrorを返す", () => {
  const result = createRoomUseCase.execute(roomPasswordSchema.parse("alice"), playerAlice.id);

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(AlreadyJoinedOtherRoomError);
});
