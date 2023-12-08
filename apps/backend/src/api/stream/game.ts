import { observable } from "@trpc/server/observable";
import { injectable } from "tsyringe";
import { z } from "zod";

import { roomObjSchema } from "../endpoint/room";
import { changePhaseEE, roomUpdateEE } from "../stream";
import { publicProcedure, router } from "../trpc";

const changePhaseEventSchema = z.object({
  eventType: z.literal("changePhase"),
  phase: z.union([z.literal("EXPULSION"), z.literal("KILLED")]).or(roomObjSchema.shape.state),
  day: z.number().int().nonnegative(),
});
const roomUpdateEventSchema = z
  .object({
    eventType: z.literal("roomUpdate"),
  })
  .and(roomObjSchema);
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
