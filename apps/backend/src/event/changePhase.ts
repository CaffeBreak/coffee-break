import { z } from "zod";

import { ee } from "./common";

import { EventPort } from "@/misc/event";

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

export type ChangePhaseEventPayload = z.infer<typeof changePhaseEventSchema>;

export const changePhaseEE: EventPort<(payload: ChangePhaseEventPayload) => void> = new EventPort(
  "changePhase",
  ee,
);
