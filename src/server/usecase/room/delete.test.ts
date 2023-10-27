import { container } from "tsyringe";
import { beforeEach, expect, it } from "vitest";

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
import { OperationNotAllowedError } from "@/server/error/usecase/common";
import { RoomNotFoundError } from "@/server/error/usecase/room";

import { DeleteRoomUseCase } from "./delete";

const playerRepository = container.resolve<InMemoryPlayerRepository>("PlayerRepository");
const roomRepository = container.resolve<InMemoryRoomRepository>("RoomRepository");

const deleteRoomUseCase = container.resolve(DeleteRoomUseCase);

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
  roomIdSchema.parse("9kzx7hf7w4"),
);

const roomA = new Room(
  roomIdSchema.parse("9kzx7hf7w4"),
  roomPasswordSchema.parse("hogehoge"),
  playerIdSchema.parse("9kvyrk2hq9"),
  roomStateSchema.parse("BEFORE_START"),
  [playerIdSchema.parse("9kvyrk2hq9"), playerIdSchema.parse("9kvyrk2hqa")],
);

beforeEach(() => {
  playerRepository.store = [playerAlice, playerBob];
  roomRepository.store = [roomA];
});

it("部屋IDに一致する部屋が存在する場合、部屋作成者はそれを削除できる。また、その部屋に参加していた人は部屋から退出する", () => {
  const result = deleteRoomUseCase.execute(roomA.id, playerAlice.id);

  expect(result.isOk()).toBe(true);
  expect(roomRepository.store).toStrictEqual([]);
  expect(playerRepository.store).not.toMatchObject([{ _roomId: roomA.id }, { _roomId: roomA.id }]);
});

it("部屋作成者でなければ部屋を削除することはできず、OperationNotAllowedErrorを返す", () => {
  const result = deleteRoomUseCase.execute(roomA.id, playerBob.id);

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(OperationNotAllowedError);
});

it("部屋IDに一致する部屋が存在しない場合、RoomNotFoundErrorを返す", () => {
  const result = deleteRoomUseCase.execute(roomIdSchema.parse("9kzx7hf7w5"), playerAlice.id);

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(RoomNotFoundError);
});
