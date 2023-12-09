import { useAtomValue, useSetAtom } from "jotai";

import { BackButton } from "./button/BackButton";
import { PrevScreenStateAtom, ScreenStateAtom } from "../atoms/ScreenState";

export const Header = () => {
  const setScreenState = useSetAtom(ScreenStateAtom);
  const prevScreenState = useAtomValue(PrevScreenStateAtom);
  const backToPrevScreen = () => setScreenState(prevScreenState);

  return (
    <header className="h-[70px] w-full bg-yellow-800">
      {prevScreenState && <BackButton onClick={backToPrevScreen} />}
    </header>
  );
};
