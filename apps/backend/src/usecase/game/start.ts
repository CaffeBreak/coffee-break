import { setTimeout } from "timers/promises";

import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import type { IPlayerRepository } from "@/domain/repository/interface/player";
import type { IRoomRepository } from "@/domain/repository/interface/room";

import { changePhaseEE, ee } from "@/api/stream";
import { PlayerId } from "@/domain/entity/player";
import { RoomId } from "@/domain/entity/room";
import { OperationNotAllowedError, UseCaseError } from "@/error/usecase/common";
import { PlayerNotFoundError } from "@/error/usecase/player";
import { RoomNotFoundError } from "@/error/usecase/room";
import { voidType } from "@/misc/type";

@injectable()
export class StartGameUseCase {
  constructor(
    @inject("RoomRepository") private readonly roomRepository: IRoomRepository,
    @inject("PlayerRepository") private readonly playerRepository: IPlayerRepository,
  ) {}

  public async execute(operator: PlayerId, roomId: RoomId): Promise<Result<void, UseCaseError>> {
    // 該当の部屋が存在しないならゲームの開始はできない
    const roomResult = await this.roomRepository.findById(roomId);
    if (roomResult.isErr()) {
      return new Err(new RoomNotFoundError());
    }
    const room = roomResult.unwrap();

    // 該当のプレイヤーが存在しないならゲームの開始はできない
    const playerResult = await this.playerRepository.findById(operator);
    if (playerResult.isErr()) {
      return new Err(new PlayerNotFoundError());
    }
    const player = playerResult.unwrap();

    // 実行者が部屋作成者でなければゲームの開始はできない
    if (room.ownerId !== player.id) {
      return new Err(new OperationNotAllowedError());
    }

    void this.startGameRoutine();

    return new Ok(voidType);
  }

  private async startGameRoutine() {
    let day = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // ゲーム開始するよ
      ee.emit(changePhaseEE, {
        eventType: "changePhase",
        phase: "DISCUSSION",
        day,
      });

      // 10秒待つよ
      await setTimeout(10000);

      // 投票するよ
      ee.emit(changePhaseEE, {
        eventType: "changePhase",
        phase: "VOTING",
        day,
      });

      // 10秒待つよ
      await setTimeout(10000);

      // 追放するよ
      ee.emit(changePhaseEE, {
        eventType: "changePhase",
        phase: "EXPULSION",
        day,
      });

      if ((Math.random() | (0 * 100)) % 2 === 0) break;

      // カード使うよ
      ee.emit(changePhaseEE, {
        eventType: "changePhase",
        phase: "USING",
        day,
      });

      // 10秒待つよ
      await setTimeout(10000);

      day += 1;

      // グエー死んだンゴ
      ee.emit(changePhaseEE, {
        eventType: "changePhase",
        phase: "KILLED",
        day: 255,
      });

      if ((Math.random() | (0 * 100)) % 2 === 0) break;
    }

    // ゲームおわり
    ee.emit(changePhaseEE, {
      eventType: "changePhase",
      phase: "FINISHED",
      day,
    });
  }
}
