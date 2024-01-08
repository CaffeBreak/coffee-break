import { useAtom, useAtomValue } from "jotai";

import { PlayerStateAtom } from "@/components/atoms/PlayerState";
import { RoomStateAtom } from "@/components/atoms/RoomState";
import { ScreenStateAtom } from "@/components/atoms/ScreenState";
import { trpc } from "@/utils/trpc";

import { ViewRole } from "./ViewRole";

export const GameScreen = () => {
  const screenState = useAtomValue(ScreenStateAtom);
  const [roomObject, setRoomObject] = useAtom(RoomStateAtom);
  const [playerObject, setPlayerObject] = useAtom(PlayerStateAtom);

  trpc.stream.gameStream.useSubscription(
    { roomId: roomObject.id, playerId: playerObject.id },
    {
      onData: (data) => {
        console.log(data);
        switch (data.eventType) {
          case "changePhase":
            setRoomObject((prev) => ({ ...prev, phase: data.phase, day: data.day }));
            break;

          case "playerUpdate":
            setPlayerObject((prev) => ({ ...prev, ...data }));
            break;

          case "roomUpdate":
            break;
        }
      },
    },
  );

  return <div>{screenState === "Game-ViewRole" && <ViewRole />}</div>;
};
