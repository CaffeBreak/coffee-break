import { container } from "tsyringe";
import { beforeEach, expect } from "vitest";
import { it } from "vitest";

import { JoinRoomUseCase } from "./join";

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
import { AlreadyJoinedOtherRoomError, PlayerNotFoundError } from "@/error/usecase/player";
import { PasswordMismatchError, PlayerNameDuplicatedError } from "@/error/usecase/room";

const playerRepository = container.resolve<InMemoryPlayerRepository>("PlayerRepository");
const roomRepository = container.resolve<InMemoryRoomRepository>("RoomRepository");

const joinRoomUseCase = container.resolve(JoinRoomUseCase);

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
const playerAlice2 = new Player(
  playerIdSchema.parse("9kvyrk2hqb"),
  playerNameSchema.parse("Alice"),
  playerRoleSchema.parse("PENDING"),
  playerStatusSchema.parse("ALIVE"),
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
  playerRepository.store = [playerAlice, playerBob, playerAlice2];
  roomRepository.store = [roomA];
});

it("部屋IDに一致する部屋が存在し、合言葉が一致する場合、部屋に参加できる", async () => {
  const result = await joinRoomUseCase.execute(roomPasswordSchema.parse("hogehoge"), playerBob.id);

  expect(result.isOk()).toBe(true);
  expect(result.unwrap()).toBe(roomA);
  expect(playerRepository.store[1]).toMatchObject({
    roomId: roomA.id,
  });
  expect(roomRepository.store[0].players).toStrictEqual([playerAlice, playerBob]);
});

it("プレイヤーIDに一致するプレイヤーが存在しない場合、PlayerNotFoundErrorを返す", async () => {
  const result = await joinRoomUseCase.execute(
    roomPasswordSchema.parse("hogehoge"),
    playerIdSchema.parse("9kvyrk2hqc"),
  );

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(PlayerNotFoundError);
});

it("プレイヤーIDに一致するプレイヤーが既に他の部屋に参加している場合、AlreadyJoinedOtherRoomErrorを返す", async () => {
  const result = await joinRoomUseCase.execute(
    roomPasswordSchema.parse("hogehoge"),
    playerAlice.id,
  );

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(AlreadyJoinedOtherRoomError);
});

it("合言葉が一致しなければ、PasswordMismatchErrorを返す", async () => {
  const result = await joinRoomUseCase.execute(
    roomPasswordSchema.parse("fugafuga"),
    playerAlice2.id,
  );

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(PasswordMismatchError);
});

it("同じ名前のプレイヤーが同じ部屋に入ることはできず、PlayerNameDuplicateErrorを返す", async () => {
  const result = await joinRoomUseCase.execute(
    roomPasswordSchema.parse("hogehoge"),
    playerAlice2.id,
  );

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(PlayerNameDuplicatedError);
});
