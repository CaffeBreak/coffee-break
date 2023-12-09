import { z } from "zod";

import { PlayerId } from "./player";
import { RoomId } from "./room";

export const comessageSchema = z.object({
  type: z.literal("co"),
  cardtype: z.literal("test"),
});

export type messagetype = z.infer<typeof comessageSchema>;

export class Post {
  public _playerId: PlayerId;
  public _message: messagetype;
  public _roomId: RoomId;

  constructor(playerid: PlayerId, message: messagetype, roomId: RoomId) {
    this._playerId = playerid;
    this._message = message;
    this._roomId = roomId;
  }
}
