import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import type { IPlayerRepository } from "@/domain/repository/interface/player";
import type { IRoomRepository } from "@/domain/repository/interface/room";

import { PlayerId } from "@/domain/entity/player";
import { RoomId } from "@/domain/entity/room";
import {
  OperationNotAllowedError,
  RepositoryOperationError,
  UseCaseError,
} from "@/error/usecase/common";
import { RoomNotFoundError } from "@/error/usecase/room";

@injectable()
export class DeleteRoomUseCase {
  constructor(
    @inject("RoomRepository") private readonly roomRepository: IRoomRepository,
    @inject("PlayerRepository") private readonly playerRepository: IPlayerRepository,
  ) {}

  public async execute(id: RoomId, operator: PlayerId): Promise<Result<void, UseCaseError>> {
    // 該当の部屋が存在しないなら消せない
    const roomResult = await this.roomRepository.findById(id);
    if (roomResult.isErr()) {
      return new Err(new RoomNotFoundError());
    }
    const room = roomResult.unwrap();

    // 削除実行者が部屋作成者でなければ部屋の削除はできない
    if (room.ownerId !== operator) {
      return new Err(new OperationNotAllowedError());
    }

    // 部屋に参加していたプレイヤーは部屋から退出する
    room.players.map((p) => {
      p.leaveRoom();
    });
    const playerRepoResult = await this.playerRepository.saveMany(room.players);
    if (playerRepoResult.isErr()) {
      return new Err(new RepositoryOperationError(playerRepoResult.unwrapErr()));
    }

    // 部屋を削除する
    const roomRepoResult = await this.roomRepository.delete(room.id);
    if (roomRepoResult.isErr()) {
      return new Err(new RepositoryOperationError(roomRepoResult.unwrapErr()));
    }

    return new Ok(roomRepoResult.unwrap());
  }
}
