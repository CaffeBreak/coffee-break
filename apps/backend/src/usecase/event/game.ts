import { setTimeout } from "timers/promises";

import { match } from "ts-pattern";
import { inject, injectable } from "tsyringe";

import type { IRoomRepository } from "@/domain/repository/interface/room";

import { roomIdSchema } from "@/domain/entity/room";
import { changePhaseEE } from "@/event/changePhase";
import { ee } from "@/event/common";

@injectable()
export class EventUseCase {
  constructor(@inject("RoomRepository") private readonly roomRepository: IRoomRepository) {}

  public execute() {
    changePhaseEE.on((payload) => {
      const changePhase = async () => {
        const roomResult = await this.roomRepository.findById(roomIdSchema.parse(payload.roomId));
        const room = roomResult.unwrap();

        const next = room.nextPhase();
        await this.roomRepository.save(room);

        ee.emit(changePhaseEE, {
          eventType: "changePhase",
          roomId: room.id,
          phase: next,
          day: room.day,
        });
      };

      match(payload.phase)
        .when(
          (phase) => phase === "DISCUSSION" || phase === "USING" || phase === "VOTING",
          async () => {
            await setTimeout(1 * 60 * 1000);
            await changePhase();
          },
        )
        .otherwise(async () => await changePhase())
        .catch(() => {});
    });
  }
}
