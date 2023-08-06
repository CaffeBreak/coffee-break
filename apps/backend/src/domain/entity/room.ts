import { z } from "zod";

import { PlayerId } from "./player";

import { Id, genId, idSchema } from "@/misc/id";

export const roomIdSchema = idSchema.brand("roomId");
export const roomPasswordSchema = z
  .string()
  .regex(/^[^\s]{1,16}$/)
  .brand("roomPassword");
export const roomStateSchema = z
  .union([
    z.literal("BEFORE_START"),
    // z.literal("USING"),
    z.literal("DISCUSSION"),
    // z.literal("VOTING"),
    z.literal("FINISHED"),
  ])
  .brand("roomStatus");

export type RoomId = z.infer<typeof roomIdSchema>;
export type RoomPassword = z.infer<typeof roomPasswordSchema>;
export type RoomState = z.infer<typeof roomStateSchema>;

export class Room {
  public readonly roomId: RoomId;
  private readonly _password: RoomPassword;
  public readonly ownerId: Id;
  private _state: RoomState;
  private _players: Id[];

  constructor(
    roomId: RoomId,
    password: RoomPassword,
    ownerId: PlayerId,
    state: RoomState,
    players: PlayerId[],
  ) {
    this.roomId = roomId;
    this._password = password;
    this.ownerId = ownerId;
    this._state = state;
    this._players = players;
  }

  get state() {
    return this._state;
  }

  get players() {
    return this._players;
  }

  public static new(password: RoomPassword, ownerId: PlayerId): Room {
    return new Room(genId(), password, ownerId, roomStateSchema.parse("BEFORE_START"), [ownerId]);
  }

  public join(player: Id) {
    this._players.push(player);
  }

  public start() {
    this._state = roomStateSchema.parse("DISCUSSION");
  }

  public finish() {
    this._state = roomStateSchema.parse("FINISHED");
  }

  public checkPassword(password: RoomPassword): boolean {
    return password === this._password;
  }
}
