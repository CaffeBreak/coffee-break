import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { DeathStateAtom } from "@/components/atoms/DeathState";
import { PlayerStateAtom } from "@/components/atoms/PlayerState";
import { RoomStateAtom } from "@/components/atoms/RoomState";
import { ScreenStateAtom } from "@/components/atoms/ScreenState";
import { trpc } from "@/utils/trpc";

import { PlayRoom } from "./PlayRoom";
import { ViewRole } from "./ViewRole";

export const GameScreen = () => {
  const screenState = useAtomValue(ScreenStateAtom);
  const [roomObject, setRoomObject] = useAtom(RoomStateAtom);
  const [playerObject, setPlayerObject] = useAtom(PlayerStateAtom);
  const setDeath = useSetAtom(DeathStateAtom);

  let prevRoomObjectPlayers: { status: string }[];

  trpc.stream.gameStream.useSubscription(
    { roomId: roomObject.id, playerId: playerObject.id },
    {
      onData: (data) => {
        console.log(data);
        switch (data.eventType) {
          case "changePhase":
            setRoomObject((prev) => ({
              ...prev,
              phase: data.phase,
              day: data.day,
              winner: data.winner,
            }));
            break;

          case "playerUpdate":
            setPlayerObject((prev) => ({ ...prev, ...data }));
            break;

          case "roomUpdate":
            prevRoomObjectPlayers = roomObject.players;
            setRoomObject((prev) => ({ ...prev, ...data }));
            data.players.forEach((player, i) => {
              if (player.status !== prevRoomObjectPlayers[i].status) {
                setDeath((prev) => [...prev, player.name]);
              }
            });
            break;
        }
      },
    },
  );

  return (
    <div>
      {screenState === "Game-ViewRole" && <ViewRole />}
      {screenState === "Game-PlayRoom" && <PlayRoom />}
    </div>
  );
};
