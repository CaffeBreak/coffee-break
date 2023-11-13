import { z } from "zod";

import { PlayerId } from "./player";

import { genId, idSchema } from "@/misc/id";

export const roomIdSchema = idSchema.brand("roomId");
export const roomPasswordSchema = z
  .string()
  .regex(/^[^\s]{1,16}$/)
  .brand("roomPassword");
export const roomStateSchema = z
  .union([
    z.literal("BEFORE_START"),
    z.literal("USING"),
    z.literal("DISCUSSION"),
    z.literal("VOTING"),
    z.literal("FINISHED"),
  ])
  .brand("roomStatus");

export type RoomId = z.infer<typeof roomIdSchema>;
export type RoomPassword = z.infer<typeof roomPasswordSchema>;
export type RoomState = z.infer<typeof roomStateSchema>;

export class Room {
  public readonly id: RoomId;
  public readonly password: RoomPassword;
  private _ownerId: PlayerId;
  private _state: RoomState;
  private _players: PlayerId[];

  constructor(
    id: RoomId,
    password: RoomPassword,
    ownerId: PlayerId,
    state: RoomState,
    players: PlayerId[],
  ) {
    this.id = id;
    this.password = password;
    this._ownerId = ownerId;
    this._state = state;
    this._players = players;
  }

  get ownerId() {
    return this._ownerId;
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

  public join(player: PlayerId) {
    this._players.push(player);
  }

  public leave(player: PlayerId) {
    this._players = this._players.filter((value) => value !== player);
    if (this._ownerId === player && this._players.length > 0) {
      this._ownerId = this._players[0];
    }
  }

  public startGame() {
    this._state = roomStateSchema.parse("DISCUSSION");
  }

  public finishGame() {
    this._state = roomStateSchema.parse("FINISHED");
  }

  public checkPassword(password: RoomPassword): boolean {
    return password === this.password;
  }
}
