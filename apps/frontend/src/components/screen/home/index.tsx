import { useAtomValue } from "jotai";

import { ScreenStateAtom } from "@/components/atoms/ScreenState";

import { Baked } from "./Baked";
import { CreateRoom } from "./CreateRoom";
import { JoinRoom } from "./JoinRoom";
import { MathcingRoom } from "./MathcingRoom";
import { SelectAction } from "./SelectAction";

export const HomeScreen = () => {
  const screenState = useAtomValue(ScreenStateAtom);

  return (
    <div>
      {screenState === "Home-Baked" && <Baked />}
      {screenState === "Home-SelectAction" && <SelectAction />}
      {screenState === "Home-CreateRoom" && <CreateRoom />}
      {screenState === "Home-JoinRoom" && <JoinRoom />}
      {screenState === "Home-MathcingRoom" && <MathcingRoom />}
    </div>
  );
};
