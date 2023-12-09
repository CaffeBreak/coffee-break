import { z } from "zod";

import { PlayerId } from "./player";
import { RoomId } from "./room";

export const comessageSchema = z.object({
  type: z.literal("co"),
  cardtype: z.literal("test"),
});

export type messagetype = z.infer<typeof comessageSchema>;

export class Post {
  public readonly playerid: PlayerId;
  public readonly message: messagetype;
  public readonly roomID: RoomId;

  constructor(playerid: PlayerId, message: messagetype, roomID: RoomId) {
    this.playerid = playerid;
    this.message = message;
    this.roomID = roomID;
  }
}
