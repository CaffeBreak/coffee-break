import { z } from "zod";

import { type RoomId } from "./room";

import { genId, idSchema } from "@/misc/id";

export const playerIdSchema = idSchema.brand("playerId");
export const playerNameSchema = z
  .string()
  .regex(/^[^\s]{1,16}$/)
  .brand("playerName");
export const playerRoleSchema = z.union([
  z.literal("PENDING"),
  z.literal("VILLAGER"),
  z.literal("WEREWOLF"),
]);
export const playerStatusSchema = z.union([z.literal("ALIVE"), z.literal("DEAD")]);
const skipFlagSchema = z.boolean();

export type PlayerId = z.infer<typeof playerIdSchema>;
export type PlayerName = z.infer<typeof playerNameSchema>;
type PlayerRole = z.infer<typeof playerRoleSchema>;
type PlayerStatus = z.infer<typeof playerStatusSchema>;
type SkipFlag = z.infer<typeof skipFlagSchema>;

export class Player {
  // IDは外部から触らせても良さそう
  public readonly id: PlayerId;
  private _name: PlayerName;
  private _role: PlayerRole;
  private _status: PlayerStatus;
  private _roomId?: RoomId;
  private _skipFlag: SkipFlag;
  private _voteTarget?: PlayerId;
  private _votedPlayers: Player[] = [];

  constructor(
    id: PlayerId,
    name: PlayerName,
    role: PlayerRole,
    status: PlayerStatus,
    skipFlag: SkipFlag,
    votedPlayers: Player[],
    roomId?: RoomId,
    voteTarget?: PlayerId,
  ) {
    this.id = id;
    this._name = name;
    this._role = role;
    this._status = status;
    this._skipFlag = skipFlag;
    this._roomId = roomId;
    this._voteTarget = voteTarget;
    this._votedPlayers = votedPlayers;
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

  get skipFlag() {
    return this._skipFlag;
  }

  get voteTarget() {
    return this._voteTarget;
  }

  get votedPlayers() {
    return this._votedPlayers;
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

  public setSkipFlag() {
    this._skipFlag = true;
  }

  public resetSkipFlag() {
    this._skipFlag = false;
  }

  public vote(target: PlayerId) {
    this._voteTarget = target;
  }

  public resetVote() {
    this._voteTarget = undefined;
  }

  public static new(name: PlayerName): Player {
    return new Player(
      genId(),
      name,
      playerRoleSchema.parse("PENDING"),
      playerStatusSchema.parse("ALIVE"),
      false,
      [],
    );
  }
}
