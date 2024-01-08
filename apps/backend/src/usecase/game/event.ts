import { setTimeout } from "timers/promises";

import pc from "picocolors";
import { inject, injectable } from "tsyringe";
import { z } from "zod";

import type { IRoomRepository } from "@/domain/repository/interface/room";

import { roomIdSchema } from "@/domain/entity/room";
import { ee } from "@/event";
import { EventPort, on } from "@/misc/event";
import { log } from "@/misc/log";
import { voidType } from "@/misc/type";

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

  public async execute(changePhaseEE: EventPort<(payload: ChangePhaseEventPayload) => void>) {
    const changePhase = async (roomId: string) => {
      const room = (await this.roomRepository.findById(roomIdSchema.parse(roomId))).unwrap();
      const nextPhase = room.nextPhase();
      log("DEBUG", pc.dim(`Next phase: ${nextPhase}`));

      const newRoom = (await this.roomRepository.save(room)).unwrap();

      return newRoom;
    };

    for await (const payload of on(ee, changePhaseEE)) {
      const phase = payload[0].phase;
      const waitTime = ["DISCUSSION", "USING", "VOTING"].includes(phase) ? 1 * 10 * 1000 : 0;

      const abortController = new AbortController();
      ee.once(`skipPhase-${payload[0].roomId}`, () => {
        abortController.abort();
      });
      await setTimeout(waitTime, voidType, { signal: abortController.signal }).catch(() => {});

      const room = await changePhase(payload[0].roomId);

      ee.emit(changePhaseEE, {
        eventType: "changePhase",
        roomId: room.id,
        phase: room.phase,
        day: room.day,
      });
    }
  }
}
