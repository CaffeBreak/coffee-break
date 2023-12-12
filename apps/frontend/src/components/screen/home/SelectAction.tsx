import { useSetAtom } from "jotai";
import { useEffect } from "react";

import { PrevScreenStateAtom, ScreenStateAtom } from "@/components/atoms/ScreenState";
import { EnterButton } from "@/components/ui/button/EnterButton";

export const SelectAction = () => {
  const setScreenState = useSetAtom(ScreenStateAtom);
  const setPrevScreenState = useSetAtom(PrevScreenStateAtom);
  useEffect(() => {
    setPrevScreenState("Home-Baked");
  }, [setPrevScreenState]);

  return (
    <div className="flex h-full w-screen flex-col items-center justify-center space-y-[30px]">
      <EnterButton msg="部屋を作る" onClick={() => setScreenState("Home-CreateRoom")} />
      <EnterButton msg="部屋に入る" onClick={() => setScreenState("Home-JoinRoom")} />
    </div>
  );
};
