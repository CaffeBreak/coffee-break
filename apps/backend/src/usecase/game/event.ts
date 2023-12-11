import { inject, injectable } from "tsyringe";
import { z } from "zod";

import type { IRoomRepository } from "@/domain/repository/interface/room";

import { roomIdSchema } from "@/domain/entity/room";
import { ee } from "@/event";
import { EventPort } from "@/misc/event";

const changePhaseEventSchema = z.object({
  eventType: z.literal("changePhase"),
  roomId: z.string().regex(/^[0-9a-z]{10}$/),
  phase: z.union([
    z.literal("EXPULSION"),
    z.literal("KILLED"),
    z.literal("BEFORE_START"),
    z.literal("USING"),
    z.literal("DISCUSSION"),
    z.literal("VOTING"),
    z.literal("FINISHED"),
  ]),
  day: z.number().int().nonnegative(),
});
export type ChangePhaseEventPayload = z.infer<typeof changePhaseEventSchema>;

@injectable()
export class GameEvent {
  constructor(@inject("RoomRepository") private readonly roomRepository: IRoomRepository) {}

  public execute(changePhaseEE: EventPort<(payload: ChangePhaseEventPayload) => void>) {
    const changePhase = async (roomId: string) => {
      const room = (await this.roomRepository.findById(roomIdSchema.parse(roomId))).unwrap();
      const nextPhase = room.nextPhase();

      console.log(`next phase: ${nextPhase}`);

      await this.roomRepository.save(room);

      ee.emit(changePhaseEE, {
        eventType: "changePhase",
        roomId: room.id,
        phase: nextPhase,
        day: room.day,
      });
    };

    changePhaseEE.on((payload) => {
      const phase = payload.phase;
      const waitTime =
        phase === "DISCUSSION" || phase === "USING" || phase === "VOTING" ? 1 * 60 * 1000 : 0;

      setTimeout(() => void changePhase(payload.roomId), waitTime);
    });
  }
}
