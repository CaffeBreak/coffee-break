import { Err, Ok, Result } from "ts-results";

import { Player, PlayerName } from "@/domain/entity/player";
import { PlayerRepository } from "@/domain/repository/playerRepository";

export const CreatePlayerUseCase =
  // prettier-ignore
  (playerRepository: PlayerRepository) =>
    (name: PlayerName): Result<Player, Error> => {
      const newPlayer = Player.new(name);
      const playerResult = playerRepository.save(newPlayer);
      if (playerResult.err) {
        return Err(playerResult.unwrap());
      }

      return Ok(playerResult.unwrap());
    };
