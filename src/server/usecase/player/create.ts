import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import { Player, PlayerName } from "@/server/domain/entity/player";
import { UseCaseError } from "@/server/error/usecase/common";
import { RepositoryOperationError } from "@/server/error/usecase/common";

import type { IPlayerRepository } from "@/server/domain/repository/interface/player";

@injectable()
export class CreatePlayerUseCase {
  constructor(@inject("PlayerRepository") private playerRepository: IPlayerRepository) {}

  public execute(name: PlayerName): Result<Player, UseCaseError> {
    const newPlayer = Player.new(name);
    const playerResult = this.playerRepository.save(newPlayer);
    if (playerResult.isErr()) {
      return new Err(new RepositoryOperationError(playerResult.unwrapErr()));
    }

    return new Ok(playerResult.unwrap());
  }
}
