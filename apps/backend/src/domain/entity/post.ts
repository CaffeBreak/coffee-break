import { z } from "zod";

import { PlayerId, playerIdSchema } from "./player";
import { RoomId } from "./room";

export const comessageSchema = z.object({
  type: z.literal("co"),
  cardtype: z.literal("test"),
});

export const protectmessageSchema = z.object({
  type: z.literal("protect"),
  target: playerIdSchema,
});

export const messageSchema = z.union([comessageSchema, protectmessageSchema]);

export type messagetype = z.infer<typeof messageSchema>;

export class Post {
  public playerId: PlayerId;
  public message: messagetype;
  public roomId: RoomId;

  constructor(playerid: PlayerId, message: messagetype, roomId: RoomId) {
    this.playerId = playerid;
    this.message = message;
    this.roomId = roomId;
  }
}
