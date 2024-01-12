import { useAtomValue } from "jotai";
import { ChangeEvent, useState } from "react";

import { trpc } from "@/utils/trpc";

import { PlayerStateAtom } from "../atoms/PlayerState";
import { RoomStateAtom } from "../atoms/RoomState";

export const Voting = () => {
  const voting = trpc.game.vote.useMutation();

  const player = useAtomValue(PlayerStateAtom);
  const room = useAtomValue(RoomStateAtom);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlayer(event.target.value);
  };
  const handleVote = () => {
    if (selectedPlayer) {
      voting.mutate({ playerId: player.id, target: selectedPlayer });
    }
  };

  return (
    <div>
      <select onChange={handleSelect}>
        {room.players.map((player) => {
          return (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          );
        })}
      </select>
      <button onClick={handleVote}>Vote</button>
    </div>
  );
};
