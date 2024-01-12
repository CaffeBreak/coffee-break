import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import { PlayerStateAtom } from "@/components/atoms/PlayerState";
import { ScreenStateAtom } from "@/components/atoms/ScreenState";

export const ViewRole = () => {
  const setScreenState = useSetAtom(ScreenStateAtom);
  const player = useAtomValue(PlayerStateAtom);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreenState("Game-PlayRoom");
    }, 5000);
    return () => clearTimeout(timer);
  }, [setScreenState]);

  return (
    <div
      className="h-screen w-screen bg-yellow-950 text-3xl text-white"
      onMouseDown={() => setScreenState("Game-PlayRoom")}
    >
      <div className="flex h-full items-center justify-center">
        あなたは
        {player.role === "VILLAGER" ? (
          <span className="text-blue-500">村人</span>
        ) : (
          <span className="text-red-500">人狼</span>
        )}
        です
      </div>
    </div>
  );
};
