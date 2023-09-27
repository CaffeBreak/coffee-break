import { Err, Ok, Result } from "ts-results";
import { inject, injectable } from "tsyringe";

import type { IPlayerRepository } from "@/domain/repository/interface/playerRepository";

import { PlayerId } from "@/domain/entity/player";
import { UseCaseError } from "@/error/usecase/common";
import { PlayerNotFoundError } from "@/error/usecase/player";
import { RepositoryOperationError } from "@/error/usecase/room";

@injectable()
export class DeletePlayerUseCase {
  constructor(@inject("PlayerRepository") private playerRepository: IPlayerRepository) {}

  public execute(id: PlayerId): Result<void, UseCaseError> {
    // 該当のプレイヤーが存在しないなら削除できない
    const playerResult = this.playerRepository.findById(id);
    if (playerResult.err) {
      return Err(new PlayerNotFoundError());
    }
    const player = playerResult.unwrap();

    // プレイヤーを削除する
    const playerRepoResult = this.playerRepository.delete(player.id);
    if (playerRepoResult.err) {
      return Err(new RepositoryOperationError(playerRepoResult.val));
    }

    return Ok(playerRepoResult.unwrap());
  }
}
