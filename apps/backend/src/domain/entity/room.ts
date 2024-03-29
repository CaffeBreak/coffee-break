import { match } from "ts-pattern";
import { z } from "zod";

import { Player, PlayerId } from "./player";

import { unreachable } from "@/misc/error";
import { genId, idSchema } from "@/misc/id";

export const roomIdSchema = idSchema.brand("roomId");
export const roomPasswordSchema = z
  .string()
  .regex(/^[^\s]{1,16}$/)
  .brand("roomPassword");
export const roomPhaseSchema = z.union([
  z.literal("EXPULSION"),
  z.literal("KILLED"),
  z.literal("BEFORE_START"),
  z.literal("USING"),
  z.literal("DISCUSSION"),
  z.literal("VOTING"),
  z.literal("FINISHED"),
]);
export const roomDaySchema = z.number().int().nonnegative();
const roomWinnerSchema = z.union([z.literal("VILLAGER"), z.literal("WEREWOLF")]).optional();

export type RoomId = z.infer<typeof roomIdSchema>;
export type RoomPassword = z.infer<typeof roomPasswordSchema>;
export type RoomPhase = z.infer<typeof roomPhaseSchema>;
export type RoomDay = z.infer<typeof roomDaySchema>;
type RoomWinner = z.infer<typeof roomWinnerSchema>;

export class Room {
  public readonly id: RoomId;
  public readonly password: RoomPassword;
  private _ownerId: PlayerId;
  private _phase: RoomPhase;
  private _players: Player[];
  private _day: RoomDay;
  private _winner: RoomWinner;

  constructor(
    id: RoomId,
    password: RoomPassword,
    ownerId: PlayerId,
    phase: RoomPhase,
    players: Player[],
    day: RoomDay,
    winner: RoomWinner = undefined,
  ) {
    this.id = id;
    this.password = password;
    this._ownerId = ownerId;
    this._phase = phase;
    this._players = players;
    this._day = day;
    this._winner = winner;
  }

  get ownerId() {
    return this._ownerId;
  }

  get phase() {
    return this._phase;
  }

  get players() {
    return this._players;
  }

  get day() {
    return this._day;
  }

  get winner() {
    return this._winner;
  }

  get canSkipPhase() {
    return this._players
      .filter((player) => player.status === "ALIVE")
      .every((player) => player.skipFlag || player.voteTarget);
  }

  public static new(password: RoomPassword, owner: Player): Room {
    return new Room(genId(), password, owner.id, "BEFORE_START", [owner], 0);
  }

  public join(player: Player) {
    this._players.push(player);
  }

  public leave(player: Player) {
    this._players = this._players.filter((value) => value.id !== player.id);
    if (this._ownerId === player.id && this._players.length > 0) {
      this._ownerId = this._players[0].id;
    }
  }

  public nextPhase(): RoomPhase {
    const next: RoomPhase = match<RoomPhase, RoomPhase>(this._phase)
      .with("BEFORE_START", () => "USING")
      .with("DISCUSSION", () => "VOTING")
      .with("EXPULSION", () => {
        if (
          this._players
            .filter((value) => value.status === "ALIVE")
            .every((value, _, array) => array[0].role === value.role)
        ) {
          const winner = this._players.filter((value) => value.status === "ALIVE")[0].role;
          if (winner === "PENDING") {
            unreachable();
          }
          this._winner = winner as "VILLAGER" | "WEREWOLF";

          return "FINISHED";
        }
        (() => {})();

        return "USING";
      })
      .with("FINISHED", () => "BEFORE_START")
      .with("KILLED", () => {
        if (
          this._players
            .filter((value) => value.status === "ALIVE")
            .every((value, _, array) => array[0].role === value.role)
        ) {
          const winner = this._players.filter((value) => value.status === "ALIVE")[0].role;
          if (winner === "PENDING") {
            unreachable();
          }
          this._winner = winner as "VILLAGER" | "WEREWOLF";

          return "FINISHED";
        }
        this._day += 1;

        return "DISCUSSION";
      })
      .with("USING", () => "KILLED")
      .with("VOTING", () => "EXPULSION")
      .exhaustive();
    this._phase = next;

    return next;
  }

  public checkPassword(password: RoomPassword): boolean {
    return password === this.password;
  }

  public resetSkipFlag() {
    this._players.map((player) => player.resetSkipFlag());
  }

  public resetVote() {
    this._players.map((player) => player.resetVote());
  }
}
