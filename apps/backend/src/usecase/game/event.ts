import { setTimeout } from "timers/promises";

import pc from "picocolors";
import { match } from "ts-pattern";
import { inject, injectable } from "tsyringe";
import { z } from "zod";

import type { IRoomRepository } from "@/domain/repository/interface/room";

import { PlayerId } from "@/domain/entity/player";
import { roomIdSchema } from "@/domain/entity/room";
import { ee } from "@/event";
import { EventPort, on } from "@/misc/event";
import { log } from "@/misc/log";
import { voidType } from "@/misc/type";

const changePhaseEventSchema = z.object({
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
const roomUpdateEventSchema = z.object({
  eventType: z.literal("roomUpdate"),
  id: z.string().regex(/^[0-9a-z]{10}$/),
  password: z.string().regex(/^[^\s]{1,16}$/),
  ownerId: z.string().regex(/^[0-9a-z]{10}$/),
  phase: z.union([
    z.literal("EXPULSION"),
    z.literal("KILLED"),
    z.literal("BEFORE_START"),
    z.literal("USING"),
    z.literal("DISCUSSION"),
    z.literal("VOTING"),
    z.literal("FINISHED"),
  ]),
  players: z.array(
    z.object({
      id: z.string().regex(/^[0-9a-z]{10}$/),
      name: z.string().regex(/^[^\s]{1,16}$/),
      role: z.union([z.literal("PENDING"), z.literal("VILLAGER"), z.literal("WEREWOLF")]),
      status: z.union([z.literal("ALIVE"), z.literal("DEAD")]),
    }),
  ),
  day: z.number().int().nonnegative(),
});
const playerUpdateEventSchema = z.object({
  eventType: z.literal("playerUpdate"),
  id: z.string().regex(/^[0-9a-z]{10}$/),
  name: z.string().regex(/^[^\s]{1,16}$/),
  role: z.union([z.literal("PENDING"), z.literal("VILLAGER"), z.literal("WEREWOLF")]),
  status: z.union([z.literal("ALIVE"), z.literal("DEAD")]),
});

export type ChangePhaseEventPayload = z.infer<typeof changePhaseEventSchema>;
export type RoomUpdateEventPayload = z.infer<typeof roomUpdateEventSchema>;
export type PlayerUpdateEventPayload = z.infer<typeof playerUpdateEventSchema>;

@injectable()
export class GameEvent {
  constructor(@inject("RoomRepository") private readonly roomRepository: IRoomRepository) {}

  public async execute(changePhaseEE: EventPort<(payload: ChangePhaseEventPayload) => void>) {
    for await (const payload of on(ee, changePhaseEE)) {
      const phase = payload[0].phase;
      const waitTime = ["DISCUSSION", "USING", "VOTING"].includes(phase) ? 1 * 10 * 1000 : 0;

      const abortController = new AbortController();
      ee.once(`skipPhase-${payload[0].roomId}`, () => {
        abortController.abort();
      });
      await setTimeout(waitTime, voidType, { signal: abortController.signal }).catch(() => {});

      await match(phase)
        .with("VOTING", async () => await this.randomVote(payload[0].roomId))
        .with("EXPULSION", async () => await this.explusion(payload[0].roomId))
        .otherwise(() => {});
      if (phase === "FINISHED") {
        break;
      }
      const room = await this.changePhase(payload[0].roomId);

      ee.emit(changePhaseEE, {
        eventType: "changePhase",
        roomId: room.id,
        phase: room.phase,
        day: room.day,
      });
    }
  }

  private async changePhase(roomId: string) {
    const room = (await this.roomRepository.findById(roomIdSchema.parse(roomId))).unwrap();
    match(room.phase)
      .with("DISCUSSION", () => room.resetSkipFlag())
      .otherwise(() => {});
    const nextPhase = room.nextPhase();
    log("DEBUG", pc.dim(`Next phase: ${nextPhase}`));

    const newRoom = (await this.roomRepository.save(room)).unwrap();

    return newRoom;
  }

  private async randomVote(roomId: string) {
    const room = (await this.roomRepository.findById(roomIdSchema.parse(roomId))).unwrap();
    room.players
      .filter((player) => player.status === "ALIVE" && !player.voteTarget && !player.skipFlag)
      .forEach((player) => {
        const targetPlayer = room.players[Math.floor(Math.random() * room.players.length)];
        player.vote(targetPlayer.id);

        log("DEBUG", pc.dim(`Random voted: ${player.id} voted ${targetPlayer.id}`));
      });

    const saveResult = await this.roomRepository.save(room);
    if (saveResult.isErr()) {
      throw saveResult.unwrapErr();
    }
  }

  private async explusion(roomId: string) {
    const room = (await this.roomRepository.findById(roomIdSchema.parse(roomId))).unwrap();
    const players = room.players.filter((player) => player.status === "ALIVE");
    const votes = players
      .filter((player) => player.voteTarget)
      .map((player) => player.voteTarget as PlayerId);

    log(
      "DEBUG",
      pc.dim(
        `Votes: ${JSON.stringify(
          room.players.map(
            (player) =>
              `${player.name}(${player.id}): ${
                // prettier-ignore
                player.status === "ALIVE"
                  ? `${players.find((p) => p.id === player.voteTarget)?.name}(${
                    player.voteTarget
                  })` ?? "Skip"
                  : "DEAD"
              }`,
          ),
          null,
          2,
        )}`,
      ),
    );

    // 最も投票されたプレイヤーを処刑する
    const voteCountMap = new Map<PlayerId, number>();
    votes.forEach((vote) => {
      if (voteCountMap.has(vote)) {
        voteCountMap.set(vote, voteCountMap.get(vote) ?? 0 + 1);
      } else {
        voteCountMap.set(vote, 1);
      }
    });
    const maxVoteCount = Math.max(...voteCountMap.values());
    const maxVoteTargets: [PlayerId, number][] = [];
    voteCountMap.forEach((voteCount, voteTarget) => {
      if (voteCount === maxVoteCount) {
        maxVoteTargets.push([voteTarget, voteCount]);
      }
    });
    let targetPlayer: PlayerId;
    if (maxVoteTargets.length === 0) {
      // 誰も投票していない場合はランダムに処刑する
      const target = players[Math.floor(Math.random() * players.length)];
      targetPlayer = target.id;
    } else if (maxVoteTargets.length === 1) {
      const [maxVoteTarget] = maxVoteTargets;
      targetPlayer = maxVoteTarget[0];
    } else {
      // 最大投票数が同数の場合は最大投票数のプレイヤーをランダムに処刑する
      const [maxVoteTarget] = maxVoteTargets[Math.floor(Math.random() * maxVoteTargets.length)];
      targetPlayer = maxVoteTarget;
    }

    // 処刑する
    const index = room.players.findIndex((player) => player.id === targetPlayer);
    room.players[index].kill();
    room.resetSkipFlag();
    room.resetVote();

    log("DEBUG", pc.dim(`Expulsed: ${room.players[index].name}(${targetPlayer})`));

    const saveResult = await this.roomRepository.save(room);
    if (saveResult.isErr()) {
      throw saveResult.unwrapErr();
    }

    const roomUpdateEE: EventPort<(payload: RoomUpdateEventPayload) => void> = new EventPort(
      `roomUpdate-${room.id}`,
      ee,
    );
    const playerUpdateEE: EventPort<(payload: PlayerUpdateEventPayload) => void> = new EventPort(
      `playerUpdate-${targetPlayer}`,
      ee,
    );

    ee.emit(roomUpdateEE, {
      eventType: "roomUpdate",
      id: room.id,
      password: room.password,
      ownerId: room.ownerId,
      phase: room.phase,
      players: room.players.map((player) => ({
        id: player.id,
        name: player.name,
        role: player.role,
        status: player.status,
      })),
      day: room.day,
    });

    ee.emit(playerUpdateEE, {
      eventType: "playerUpdate",
      id: targetPlayer,
      name: room.players[index].name,
      role: room.players[index].role,
      status: room.players[index].status,
    });
  }
}
