import { container } from "tsyringe";
import { beforeEach, expect, it } from "vitest";

import { LeaveRoomUseCase } from "./leave";

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
import { PlayerNotFoundError } from "@/error/usecase/player";
import { PlayerNotJoinedRoomError, RoomNotFoundError } from "@/error/usecase/room";

const playerRepository = container.resolve<InMemoryPlayerRepository>("PlayerRepository");
const roomRepository = container.resolve<InMemoryRoomRepository>("RoomRepository");

const leaveRoomUseCase = container.resolve(LeaveRoomUseCase);

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
const playerCffnpwr = new Player(
  playerIdSchema.parse("9kvyrk2hqb"),
  playerNameSchema.parse("cffnpwr"),
  playerRoleSchema.parse("PENDING"),
  playerStatusSchema.parse("ALIVE"),
  roomIdSchema.parse("9kzx7hf7w5"),
);

const roomA = new Room(
  roomIdSchema.parse("9kzx7hf7w4"),
  roomPasswordSchema.parse("hogehoge"),
  playerAlice.id,
  roomPhaseSchema.parse("BEFORE_START"),
  [playerAlice],
  0,
);

beforeEach(() => {
  playerRepository.store = [playerAlice, playerBob, playerCffnpwr];
  roomRepository.store = [roomA];
});

it("プレイヤーIDに一致するプレイヤーが存在する場合、部屋から退出できる", async () => {
  const result = await leaveRoomUseCase.execute(playerAlice.id);

  expect(result.isOk()).toBe(true);
  expect(result.unwrap().players).not.toContain(playerAlice.id);
  expect(
    playerRepository.store.find((player) => player.id === playerAlice.id)?.roomId,
  ).toBeUndefined();
});

it("プレイヤーIDに一致するプレイヤーが存在しない場合、PlayerNotFoundErrorを返す", async () => {
  const result = await leaveRoomUseCase.execute(playerIdSchema.parse("9kvyrk2hqc"));

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(PlayerNotFoundError);
});

it("該当のプレイヤーが部屋に参加していない場合、PlayerNotJoinedRoomErrorを返す", async () => {
  const result = await leaveRoomUseCase.execute(playerBob.id);

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(PlayerNotJoinedRoomError);
});

it("プレイヤーが部屋に参加しているが、該当の部屋が存在しない場合、RoomNotFoundErrorを返す", async () => {
  const result = await leaveRoomUseCase.execute(playerCffnpwr.id);

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(RoomNotFoundError);
});
