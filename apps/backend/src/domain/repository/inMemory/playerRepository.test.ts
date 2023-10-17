import { container } from "tsyringe";
import { beforeEach, describe, expect, it } from "vitest";

import {
  Player,
  playerIdSchema,
  playerNameSchema,
  playerRoleSchema,
  playerStatusSchema,
} from "@/domain/entity/player";
import { InMemoryPlayerRepository } from "@/domain/repository/inMemory/playerRepository";
import { DataNotFoundError } from "@/error/repository";

describe("findById", () => {
  const inMemoryPlayerRepository = container.resolve(InMemoryPlayerRepository);

  const playerAlice = new Player(
    playerIdSchema.parse("9kvyrk2hq9"),
    playerNameSchema.parse("Alice"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
  );
  const playerBob = new Player(
    playerIdSchema.parse("9kvyrk2hqa"),
    playerNameSchema.parse("Bob"),
    playerRoleSchema.parse("PENDING"),
    playerStatusSchema.parse("ALIVE"),
  );

  beforeEach(() => {
    inMemoryPlayerRepository.store = [playerAlice];
  });

  it("プレイヤーIDが一致するプレイヤーが存在する場合、そのプレイヤーを取得できる", () => {
    const result = inMemoryPlayerRepository.findById(playerAlice.id);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(playerAlice);
  });

  it("プレイヤーIDが一致するプレイヤーが存在しない場合、DataNotFoundErrorを返す", () => {
    const result = inMemoryPlayerRepository.findById(playerBob.id);

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(DataNotFoundError);
  });
});
