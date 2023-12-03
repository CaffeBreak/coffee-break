import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import type { IPlayerRepository } from "@/domain/repository/interface/player";

import { PlayerId } from "@/domain/entity/player";
import { UseCaseError } from "@/error/usecase/common";
import { RepositoryOperationError } from "@/error/usecase/common";
import { PlayerNotFoundError } from "@/error/usecase/player";

@injectable()
export class DeletePlayerUseCase {
  constructor(@inject("PlayerRepository") private readonly playerRepository: IPlayerRepository) {}

  public async execute(id: PlayerId): Promise<Result<void, UseCaseError>> {
    // 該当のプレイヤーが存在しないなら削除できない
    const playerResult = await this.playerRepository.findById(id);
    if (playerResult.isErr()) {
      return new Err(new PlayerNotFoundError());
    }
    const player = playerResult.unwrap();

    // プレイヤーを削除する
    const playerRepoResult = await this.playerRepository.delete(player.id);
    if (playerRepoResult.isErr()) {
      return new Err(new RepositoryOperationError(playerRepoResult.unwrapErr()));
    }

    return new Ok(playerRepoResult.unwrap());
  }
}
