import { container } from "tsyringe";
import { beforeAll, expect, it } from "vitest";

import {
  Player,
  playerIdSchema,
  playerNameSchema,
  playerRoleSchema,
  playerStatusSchema,
} from "@/server/domain/entity/player";
import { InMemoryPlayerRepository } from "@/server/domain/repository/inMemory/player";
import { PlayerNotFoundError } from "@/server/error/usecase/player";

import { DeletePlayerUseCase } from "./delete";

const playerRepository = container.resolve<InMemoryPlayerRepository>("PlayerRepository");
const deletePlayerUseCase = container.resolve(DeletePlayerUseCase);

const playerAlice = new Player(
  playerIdSchema.parse("9kvyrk2hq9"),
  playerNameSchema.parse("Alice"),
  playerRoleSchema.parse("VILLAGER"),
  playerStatusSchema.parse("ALIVE"),
);
const playerBob = new Player(
  playerIdSchema.parse("9kvyrk2hqa"),
  playerNameSchema.parse("Bob"),
  playerRoleSchema.parse("WEREWOLF"),
  playerStatusSchema.parse("ALIVE"),
);

beforeAll(() => {
  playerRepository.store = [playerAlice];
});

it("プレイヤーIDが一致するプレイヤーが存在する場合、該当プレイヤー削除をできる", () => {
  const result = deletePlayerUseCase.execute(playerAlice.id);

  expect(result.isOk()).toBe(true);
  expect(playerRepository.store).toStrictEqual([]);
});

it("プレイヤーIDが一致するプレイヤーが存在しない場合、PlayerNotFoundErrorを返す", () => {
  const result = deletePlayerUseCase.execute(playerBob.id);

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(PlayerNotFoundError);
});
