import { observable } from "@trpc/server/observable";
import { inject, injectable } from "tsyringe";
import { z } from "zod";

import { publicProcedure, router } from "../trpc";

import { ee } from "@/event";
import { EventPort } from "@/misc/event";
import { GameEvent } from "@/usecase/game/event";

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
  players: z.array(
    z.object({
      id: z.string().regex(/^[0-9a-z]{10}$/),
      name: z.string().regex(/^[^\s]{1,16}$/),
      role: z.union([z.literal("PENDING"), z.literal("VILLAGER"), z.literal("WEREWOLF")]),
      status: z.union([z.literal("ALIVE"), z.literal("DEAD")]),
    }),
  ),
  day: z.number().int().nonnegative(),
});
export const changePhaseEventSchema = z.object({
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

const gameStreamSchema = z.union([changePhaseEventSchema, roomUpdateEventSchema]);

export type ChangePhaseEventPayload = z.infer<typeof changePhaseEventSchema>;
export type RoomUpdateEventPayload = z.infer<typeof roomUpdateEventSchema>;
type GameStreamPayload = z.infer<typeof gameStreamSchema>;

@injectable()
export class GameStream {
  constructor(@inject(GameEvent) private readonly gameEvent: GameEvent) {}

  public execute() {
    return router({
      gameStream: publicProcedure.input(z.string().regex(/^[0-9a-z]{10}$/)).subscription((opts) => {
        const { input } = opts;

        const changePhaseEE: EventPort<(payload: ChangePhaseEventPayload) => void> = new EventPort(
          `changePhase-${input}`,
          ee,
        );
        const roomUpdateEE: EventPort<(payload: RoomUpdateEventPayload) => void> = new EventPort(
          `roomUpdate-${input}`,
          ee,
        );

        this.gameEvent.execute(changePhaseEE);

        return observable<GameStreamPayload>((emit) => {
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
        });
      }),
    });
  }
}
