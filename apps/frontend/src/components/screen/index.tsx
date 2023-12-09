"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";

import { GameScreen } from "./game";
import { HomeScreen } from "./home";
import { ScreenStateAtom } from "../atoms/ScreenState";
import { Header } from "../ui/Header";

export const Screen = () => {
  const [screenState, setScreenState] = useAtom(ScreenStateAtom);

  useEffect(() => {
    setScreenState("Home-Baked");
  }, [setScreenState]);

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex grow">
        {screenState.includes("Home") && <HomeScreen />}
        {screenState.includes("Game") && <GameScreen />}
      </div>
    </div>
  );
};
