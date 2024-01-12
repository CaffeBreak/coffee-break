import { container } from "tsyringe";
import { beforeAll, expect, it } from "vitest";

import { DeletePlayerUseCase } from "./delete";

import {
  Player,
  playerIdSchema,
  playerNameSchema,
  playerRoleSchema,
  playerStatusSchema,
} from "@/domain/entity/player";
import { InMemoryPlayerRepository } from "@/domain/repository/inMemory/player";
import { PlayerNotFoundError } from "@/error/usecase/player";

const playerRepository = container.resolve<InMemoryPlayerRepository>("PlayerRepository");
const deletePlayerUseCase = container.resolve(DeletePlayerUseCase);

const playerAlice = new Player(
  playerIdSchema.parse("9kvyrk2hq9"),
  playerNameSchema.parse("Alice"),
  playerRoleSchema.parse("VILLAGER"),
  playerStatusSchema.parse("ALIVE"),
  false,
  [],
);
const playerBob = new Player(
  playerIdSchema.parse("9kvyrk2hqa"),
  playerNameSchema.parse("Bob"),
  playerRoleSchema.parse("WEREWOLF"),
  playerStatusSchema.parse("ALIVE"),
  false,
  [],
);

beforeAll(() => {
  playerRepository.store = [playerAlice];
});

it("プレイヤーIDが一致するプレイヤーが存在する場合、該当プレイヤー削除をできる", async () => {
  const result = await deletePlayerUseCase.execute(playerAlice.id);

  expect(result.isOk()).toBe(true);
  expect(playerRepository.store).toStrictEqual([]);
});

it("プレイヤーIDが一致するプレイヤーが存在しない場合、PlayerNotFoundErrorを返す", async () => {
  const result = await deletePlayerUseCase.execute(playerBob.id);

  expect(result.isErr()).toBe(true);
  expect(result.unwrapErr()).toBeInstanceOf(PlayerNotFoundError);
});
