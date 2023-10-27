import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import { PlayerId } from "@/server/domain/entity/player";
import { UseCaseError } from "@/server/error/usecase/common";
import { RepositoryOperationError } from "@/server/error/usecase/common";
import { PlayerNotFoundError } from "@/server/error/usecase/player";

import type { IPlayerRepository } from "@/server/domain/repository/interface/player";

@injectable()
export class DeletePlayerUseCase {
  constructor(@inject("PlayerRepository") private playerRepository: IPlayerRepository) {}

  public execute(id: PlayerId): Result<void, UseCaseError> {
    // 該当のプレイヤーが存在しないなら削除できない
    const playerResult = this.playerRepository.findById(id);
    if (playerResult.isErr()) {
      return new Err(new PlayerNotFoundError());
    }
    const player = playerResult.unwrap();

    // プレイヤーを削除する
    const playerRepoResult = this.playerRepository.delete(player.id);
    if (playerRepoResult.isErr()) {
      return new Err(new RepositoryOperationError(playerRepoResult.unwrapErr()));
    }

    return new Ok(playerRepoResult.unwrap());
  }
}