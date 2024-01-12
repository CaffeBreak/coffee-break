import { observable } from "@trpc/server/observable";
import pc from "picocolors";
import { injectable } from "tsyringe";
import { z } from "zod";

import { publicProcedure, router } from "../trpc";

import { ee } from "@/event";
import { EventPort } from "@/misc/event";
import { log } from "@/misc/log";

const gameStartSchema = z.object({
  playerId: z.string().regex(/^[0-9a-z]{10}$/),
  roomId: z.string().regex(/^[0-9a-z]{10}$/),
});

const playerUpdateEventSchema = z.object({
  eventType: z.literal("playerUpdate"),
  id: z.string().regex(/^[0-9a-z]{10}$/),
  name: z.string().regex(/^[^\s]{1,16}$/),
  role: z.union([z.literal("PENDING"), z.literal("VILLAGER"), z.literal("WEREWOLF")]),
  status: z.union([z.literal("ALIVE"), z.literal("DEAD")]),
});
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

const gameStreamSchema = z.union([
  changePhaseEventSchema,
  roomUpdateEventSchema,
  playerUpdateEventSchema,
]);

type PlayerUpdateEventPayload = z.infer<typeof playerUpdateEventSchema>;
export type ChangePhaseEventPayload = z.infer<typeof changePhaseEventSchema>;
export type RoomUpdateEventPayload = z.infer<typeof roomUpdateEventSchema>;
type GameStreamPayload = z.infer<typeof gameStreamSchema>;

@injectable()
export class GameStream {
  public execute() {
    return router({
      gameStream: publicProcedure.input(gameStartSchema).subscription((opts) => {
        const { input } = opts;
        const { playerId, roomId } = input;

        const changePhaseEE: EventPort<(payload: ChangePhaseEventPayload) => void> = new EventPort(
          `changePhase-${roomId}`,
          ee,
        );
        const roomUpdateEE: EventPort<(payload: RoomUpdateEventPayload) => void> = new EventPort(
          `roomUpdate-${roomId}`,
          ee,
        );
        const playerUpdateEE: EventPort<(payload: PlayerUpdateEventPayload) => void> =
          new EventPort(`playerUpdate-${playerId}`, ee);

        return observable<GameStreamPayload>((emit) => {
          log("tRPC", pc.cyan("<<< Subscription connected."));
          const onChangePhase = (data: ChangePhaseEventPayload) => {
            emit.next(data);

            log("tRPC", pc.cyan(">>> Sent change phase event."));
          };
          const onRoomUpdate = (data: RoomUpdateEventPayload) => {
            emit.next(data);

            log("tRPC", pc.cyan(">>> Sent room update event."));
          };
          const onPlayerUpdate = (data: PlayerUpdateEventPayload) => {
            emit.next(data);

            log("tRPC", pc.cyan(">>> Sent player update event."));
          };

          changePhaseEE.on(onChangePhase);
          roomUpdateEE.on(onRoomUpdate);
          playerUpdateEE.on(onPlayerUpdate);

          return () => {
            log("tRPC", pc.cyan("<<< Subscription disconnected."));

            changePhaseEE.off(onChangePhase);
            roomUpdateEE.off(onRoomUpdate);
            playerUpdateEE.off(onPlayerUpdate);
          };
        });
      }),
    });
  }
}
