import { z } from "zod";

import { genId, idSchema } from "@/server/misc/id";

import { type RoomId } from "./room";

export const playerIdSchema = idSchema.brand("playerId");
export const playerNameSchema = z
  .string()
  .regex(/^[^\s]{1,16}$/)
  .brand("playerName");
export const playerRoleSchema = z
  .union([z.literal("PENDING"), z.literal("VILLAGER"), z.literal("WEREWOLF")])
  .brand("playerRole");
export const playerStatusSchema = z
  .union([z.literal("ALIVE"), z.literal("DEAD")])
  .brand("playerStatus");

export type PlayerId = z.infer<typeof playerIdSchema>;
export type PlayerName = z.infer<typeof playerNameSchema>;
type PlayerRole = z.infer<typeof playerRoleSchema>;
type PlayerStatus = z.infer<typeof playerStatusSchema>;

export class Player {
  // IDは外部から触らせても良さそう
  public readonly id: PlayerId;
  private _name: PlayerName;
  private _role: PlayerRole;
  private _status: PlayerStatus;
  private _roomId?: RoomId;

  constructor(
    id: PlayerId,
    name: PlayerName,
    role: PlayerRole,
    status: PlayerStatus,
    roomId?: RoomId,
  ) {
    this.id = id;
    this._name = name;
    this._role = role;
    this._status = status;
    this._roomId = roomId;
  }

  get name() {
    return this._name;
  }

  get role() {
    return this._role;
  }

  set role(role) {
    if (this._role !== playerRoleSchema.parse("PENDING")) return;

    this._role = role;
  }

  get status() {
    return this._status;
  }

  get roomId() {
    return this._roomId;
  }

  public kill() {
    this._status = playerStatusSchema.parse("DEAD");
  }

  public joinRoom(roomId: RoomId) {
    this._roomId = roomId;
  }

  public leaveRoom() {
    this._roomId = undefined;
  }

  public static new(name: PlayerName): Player {
    return new Player(
      genId(),
      name,
      playerRoleSchema.parse("PENDING"),
      playerStatusSchema.parse("ALIVE"),
    );
  }
}
