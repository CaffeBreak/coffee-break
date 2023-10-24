/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";
import { useAtom } from "jotai";
import React from "react";

import { Player } from "@/components/atom/Player";

interface Props {
  placeholder: string;
}

export const InputText = (props: Props) => {
  const [player, setPlayer] = useAtom(Player);
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      className="h-[60px] w-[450px] rounded border-b-8 border-yellow-900 bg-yellow-500 px-2 text-center text-3xl text-white placeholder:text-white"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setPlayer({ ...player, name: (e.target as HTMLInputElement).value })
      }
    />
  );
};
