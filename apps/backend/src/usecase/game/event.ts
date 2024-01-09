import { setTimeout } from "timers/promises";

import pc from "picocolors";
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
export type ChangePhaseEventPayload = z.infer<typeof changePhaseEventSchema>;

@injectable()
export class GameEvent {
  constructor(@inject("RoomRepository") private readonly roomRepository: IRoomRepository) {}

  public async execute(changePhaseEE: EventPort<(payload: ChangePhaseEventPayload) => void>) {
    const changePhase = async (roomId: string) => {
      const room = (await this.roomRepository.findById(roomIdSchema.parse(roomId))).unwrap();
      room.resetSkipFlag();
      room.resetVote();
      const nextPhase = room.nextPhase();
      log("DEBUG", pc.dim(`Next phase: ${nextPhase}`));

      const newRoom = (await this.roomRepository.save(room)).unwrap();

      return newRoom;
    };

    const randomVote = async (roomId: string) => {
      const room = (await this.roomRepository.findById(roomIdSchema.parse(roomId))).unwrap();
      const players = room.players.filter((player) => player.status === "ALIVE");
      const votes = players.map((player) =>
        player.voteTarget
          ? player.voteTarget
          : players[Math.floor(Math.random() * players.length)].id,
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
      if (maxVoteTargets?.length === 1) {
        const [maxVoteTarget] = maxVoteTargets;
        targetPlayer = maxVoteTarget[0];
      } else {
        // 最大投票数が同数の場合は最大投票数のプレイヤーをランダムに処刑する
        const [maxVoteTarget] = maxVoteTargets[Math.floor(Math.random() * maxVoteTargets.length)];
        targetPlayer = maxVoteTarget;
      }

      const index = room.players.findIndex((player) => player.id === targetPlayer);
      room.players[index].kill();
      const saveResult = await this.roomRepository.save(room);
      if (saveResult.isErr()) {
        throw saveResult.unwrapErr();
      }
    };

    for await (const payload of on(ee, changePhaseEE)) {
      const phase = payload[0].phase;
      const waitTime = ["DISCUSSION", "USING", "VOTING"].includes(phase) ? 1 * 10 * 1000 : 0;

      const abortController = new AbortController();
      ee.once(`skipPhase-${payload[0].roomId}`, () => {
        abortController.abort();
      });
      await setTimeout(waitTime, voidType, { signal: abortController.signal }).catch(() => {});

      if (phase === "VOTING") {
        await randomVote(payload[0].roomId);
      }
      const room = await changePhase(payload[0].roomId);

      ee.emit(changePhaseEE, {
        eventType: "changePhase",
        roomId: room.id,
        phase: room.phase,
        day: room.day,
      });
    }
  }
}
