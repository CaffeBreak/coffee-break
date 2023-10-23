import { Err, Ok, Result } from "@cffnpwr/ts-results";
import { inject, injectable } from "tsyringe";

import type { IPlayerRepository } from "@/domain/repository/interface/playerRepository";

import { Player, PlayerName } from "@/domain/entity/player";
import { UseCaseError } from "@/error/usecase/common";
import { RepositoryOperationError } from "@/error/usecase/room";

@injectable()
export class CreatePlayerUseCase {
  constructor(@inject("PlayerRepository") private playerRepository: IPlayerRepository) {}

  public execute(name: PlayerName): Result<Player, UseCaseError> {
    const newPlayer = Player.new(name);
    const playerResult = this.playerRepository.save(newPlayer);
    if (playerResult.err) {
      return Err(new RepositoryOperationError(playerResult.unwrap()));
    }

    return Ok(playerResult.unwrap());
  }
}
