import { container } from "tsyringe";
import { beforeEach } from "vitest";
import { expect, it } from "vitest";

import { GetRoomUseCase } from "./get";

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
import { RoomNotFoundError } from "@/error/usecase/room";

const playerRepository = container.resolve<InMemoryPlayerRepository>("PlayerRepository");
const roomRepository = container.resolve<InMemoryRoomRepository>("RoomRepository");

const getRoomUseCase = container.resolve(GetRoomUseCase);

const playerAlice = new Player(
  playerIdSchema.parse("9kvyrk2hq9"),
  playerNameSchema.parse("Alice"),
  playerRoleSchema.parse("PENDING"),
  playerStatusSchema.parse("ALIVE"),
  false,
  [],
  roomIdSchema.parse("9kzx7hf7w4"),
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
  playerRepository.store = [playerAlice];
  roomRepository.store = [roomA];
});

it("RoomIDが一致する部屋が存在すればその部屋を返す", async () => {
  const result = await getRoomUseCase.execute(roomA.id);

  expect(result.isOk()).toBe(true);
  expect(result.unwrap()).toStrictEqual(roomA);
});

it("RoomIDが一致する部屋が存在しなければRoomNotFoundErrorを返す", async () => {
  const result = await getRoomUseCase.execute(roomIdSchema.parse("9kzx7hf7w5"));

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(RoomNotFoundError);
});
