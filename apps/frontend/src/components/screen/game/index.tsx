import { useAtomValue, useSetAtom } from "jotai";

import { RoomStateAtom } from "@/components/atoms/RoomState";
import { ScreenStateAtom } from "@/components/atoms/ScreenState";
import { trpc } from "@/utils/trpc";

import { ViewRole } from "./ViewRole";

export const GameScreen = () => {
  const screenState = useAtomValue(ScreenStateAtom);
  const setRoomObject = useSetAtom(RoomStateAtom);

  trpc.stream.gameStream.useSubscription(undefined, {
    onData: (data) => {
      if (data.eventType === "changePhase") {
        setRoomObject((prev) => ({ ...prev, phase: data.phase, day: data.day }));
      }
    },
  });

  return <div>{screenState === "Game-ViewRole" && <ViewRole />}</div>;
};
