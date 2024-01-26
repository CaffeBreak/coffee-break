import { useAtomValue } from "jotai";
import Image from "next/image";
import { useState } from "react";

import { DeathStateAtom } from "@/components/atoms/DeathState";
import { PlayerStateAtom } from "@/components/atoms/PlayerState";
import { RoomStateAtom } from "@/components/atoms/RoomState";
import { VoteButton } from "@/components/ui/button/VoteButton";

export const PlayRoom = () => {
  const player = useAtomValue(PlayerStateAtom);
  const roomObject = useAtomValue(RoomStateAtom);
  const [activeButton, setActiveButton] = useState("");
  const deathPlayer = useAtomValue(DeathStateAtom);
  console.log(deathPlayer);

  return (
    <div className="flex h-screen min-h-[650px] w-screen min-w-[900px] flex-col justify-between">
      <div className="flex h-[80px] w-full justify-between p-3">
        <button className="h-[55px] w-[55px] rounded-xl bg-yellow-500 p-1 text-center">
          チャット
        </button>
        <div className="flex flex-row">
          <div className="text-3xl">
            {player.role === "VILLAGER" ? (
              <span className="text-blue-500">村人 </span>
            ) : (
              <span className="text-red-500">人狼 </span>
            )}
            {roomObject.day}日目 {roomObject.phase}
          </div>
          <div className="w-8" />
          <div className="text-3xl">
            {roomObject.winner
              ? roomObject.winner === player.role
                ? "お前の勝ち"
                : "お前の負け"
              : ""}
          </div>
        </div>
        <div className="h-[50px] w-[50px]"></div>
      </div>
      <div className="flex w-full justify-between p-3">
        <div className="h-[400px] w-[180px] space-y-2 rounded bg-yellow-500 p-3">
          <div className="text-center text-xl text-white">覗き見</div>
          <div className="flex justify-center">
            <Image src="/card/peeking.png" alt={""} width="128" height="212" />
          </div>
          <div className="rounded bg-white p-1">
            ランダムに対象が選ばれる(人狼含む)。対象の手札の内容を見る。
          </div>
        </div>
        <div className="flex w-[400px] flex-col justify-center space-y-8">
          <div className="text-center text-xl">前日の夜の行動</div>
          <div className="text-center">
            {deathPlayer.map((player, index) => (
              <p key={index}>{`${player}は教育死刑された`}</p>
            ))}
          </div>
        </div>
        <div className="w-[250px]">
          <div className="m-3 text-center text-xl">
            {`${roomObject.players.filter((player) => player.status === "ALIVE").length}/7`}
          </div>
          <div className="flex-col space-y-2">
            {roomObject.players.map((player, index) => {
              if (player.status === "ALIVE") {
                return (
                  <button
                    key={index}
                    className={`w-[250px] rounded-3xl border-2 border-yellow-800 px-2 py-1 ${
                      activeButton === player.id ? "bg-red-500" : ""
                    }`}
                    onClick={() => setActiveButton(player.id)}
                  >
                    {player.name}
                  </button>
                );
              }
            })}
          </div>
        </div>
      </div>
      <div className="flex h-[150px] w-full justify-between p-3">
        <div className="mr-3 flex h-full w-full items-center justify-center space-x-2 rounded border border-gray-300 bg-gray-100">
          <div>
            <Image src="/card/peeking.png" alt={""} width="64" height="106" />
          </div>
          <div>
            <Image src="/card/peeking.png" alt={""} width="64" height="106" />
          </div>
          <div>
            <Image src="/card/peeking.png" alt={""} width="64" height="106" />
          </div>
          <div>
            <Image src="/card/peeking.png" alt={""} width="64" height="106" />
          </div>
          <div>
            <Image src="/card/peeking.png" alt={""} width="64" height="106" />
          </div>
          <div>
            <Image src="/card/peeking.png" alt={""} width="64" height="106" />
          </div>
          <div>
            <Image src="/card/peeking.png" alt={""} width="64" height="106" />
          </div>
          <div>
            <Image src="/card/peeking.png" alt={""} width="64" height="106" />
          </div>
          <div>
            <Image src="/card/peeking.png" alt={""} width="64" height="106" />
          </div>
        </div>
        <div>
          <div className="flex h-full w-[200px] items-center justify-center">
            {player.status === "ALIVE" && <VoteButton vote={activeButton} />}
          </div>
        </div>
      </div>
    </div>
  );
};
