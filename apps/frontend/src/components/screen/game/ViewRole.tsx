import { useAtomValue } from "jotai";

import { PlayerStateAtom } from "@/components/atoms/PlayerState";
import { RoomStateAtom } from "@/components/atoms/RoomState";
import { Voting } from "@/components/ui/voting";
import { trpc } from "@/utils/trpc";

export const ViewRole = () => {
  const roomObject = useAtomValue(RoomStateAtom);
  const player = useAtomValue(PlayerStateAtom);

  const skipPhase = trpc.game.skipPhase.useMutation();

  const handler = () => {
    skipPhase.mutate({ playerId: player.id });
  };

  return (
    <div>
      <div>Name: {player.name}</div>
      <div>Dead or Alive: {player.status}</div>
      <div>Role: {player.role !== "PENDING" ? player.role : "PENDING"}</div>
      <div>{roomObject.phase}</div>
      <button onClick={handler}>skip</button>
      <Voting />
    </div>
  );
};
