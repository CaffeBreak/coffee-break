import { observable } from "@trpc/server/observable";
import { injectable } from "tsyringe";
import { z } from "zod";

import { playerObjSchema } from "../endpoint/player";
import { publicProcedure, router } from "../trpc";

import {
  ChangePhaseEventPayload,
  changePhaseEE,
  changePhaseEventSchema,
} from "@/event/changePhase";
import { ee } from "@/event/common";
import { EventPort } from "@/misc/event";

const roomUpdateEventSchema = z.object({
  eventType: z.literal("roomUpdate"),
  id: z.string().regex(/^[0-9a-z]{10}$/),
  password: z.string().regex(/^[^\s]{1,16}$/),
  ownerId: z.string().regex(/^[0-9a-z]{10}$/),
  phase: z.union([
    z.literal("EXPULSION"),
    z.literal("KILLED"),
    z.literal("BEFORE_START"),
    z.literal("USING"),
    z.literal("DISCUSSION"),
    z.literal("VOTING"),
    z.literal("FINISHED"),
  ]),
  players: z.array(playerObjSchema),
  day: z.number().int().nonnegative(),
});
const tmpEventSchema = z.object({});
const gameStreamSchema = z.union([changePhaseEventSchema, tmpEventSchema]);

export type RoomUpdateEventPayload = z.infer<typeof roomUpdateEventSchema>;
type GameStreamPayload = z.infer<typeof gameStreamSchema>;

export const roomUpdateEE: EventPort<(payload: RoomUpdateEventPayload) => void> = new EventPort(
  "roomUpdate",
  ee,
);

@injectable()
export class GameStream {
  public execute() {
    return router({
      gameStream: publicProcedure.subscription(() =>
        observable<GameStreamPayload>((emit) => {
          const onChangePhase = (data: ChangePhaseEventPayload) => {
            emit.next(data);
          };
          const onRoomUpdate = (data: RoomUpdateEventPayload) => {
            emit.next(data);
          };

          changePhaseEE.on(onChangePhase);
          roomUpdateEE.on(onRoomUpdate);

          return () => {
            changePhaseEE.off(onChangePhase);
            roomUpdateEE.off(onRoomUpdate);
          };
        }),
      ),
    });
  }
}
