import { observable } from "@trpc/server/observable";
import { injectable } from "tsyringe";
import { z } from "zod";

import { ee } from "../stream";
import { publicProcedure, router } from "../trpc";

const changePhaseEventSchema = z.object({
  eventType: z.literal("changePhase"),
  phase: z.union([
    z.literal("beforeStart"),
    z.literal("discussion"),
    z.literal("voting"),
    z.literal("expulsion"),
    z.literal("usingCard"),
    z.literal("killed"),
    z.literal("finished"),
  ]),
  day: z.number().int().nonnegative(),
});
const tmpEventSchema = z.object({});
const gameStreamSchema = z.union([changePhaseEventSchema, tmpEventSchema]);

type changePhaseEventPayload = z.infer<typeof changePhaseEventSchema>;
type gameStreamPayload = z.infer<typeof gameStreamSchema>;

@injectable()
export class GameStream {
  public execute() {
    return router({
      gameStream: publicProcedure.subscription(() =>
        observable<gameStreamPayload>((emit) => {
          const onChangePhase = (data: changePhaseEventPayload) => {
            emit.next(data);
          };

          const timer = setInterval(() => {
            emit.next({
              eventType: "changePhase",
              phase: "beforeStart",
              day: Math.random(),
            });
          }, 1000);
          return () => {
            clearInterval(timer);
          };

          ee.on("changePhase", onChangePhase);

          return () => {
            ee.off("changePhase", onChangePhase);
          };
        }),
      ),
    });
  }
}
