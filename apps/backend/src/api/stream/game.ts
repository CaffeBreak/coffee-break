import { observable } from "@trpc/server/observable";
import { injectable } from "tsyringe";
import { z } from "zod";

import { changePhaseEE, roomUpdateEE } from "../stream";
import { publicProcedure, router } from "../trpc";

const changePhaseEventSchema = z.object({
  eventType: z.literal("changePhase"),
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
const roomUpdateEventSchema = z.object({
  eventType: z.literal("roomUpdate"),

  id: z.string().regex(/^[0-9a-z]{10}$/),
  password: z.string().regex(/^[^\s]{1,16}$/),
  ownerId: z.string().regex(/^[0-9a-z]{10}$/),
  state: z.union([
    z.literal("BEFORE_START"),
    z.literal("USING"),
    z.literal("DISCUSSION"),
    z.literal("VOTING"),
    z.literal("FINISHED"),
  ]),
  players: z.array(z.string().regex(/^[0-9a-z]{10}$/)),
});
const tmpEventSchema = z.object({});
const gameStreamSchema = z.union([changePhaseEventSchema, tmpEventSchema]);

export type ChangePhaseEventPayload = z.infer<typeof changePhaseEventSchema>;
export type RoomUpdateEventPayload = z.infer<typeof roomUpdateEventSchema>;
type GameStreamPayload = z.infer<typeof gameStreamSchema>;

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
