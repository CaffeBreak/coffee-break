"use client";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Player } from "@/components/atom/Player";
import { Room } from "@/components/atom/Room";
import { trpc } from "@/utils/trpc";

const RoomCreate = () => {
  const [pass, setPass] = useState("");
  const [showError, setShowError] = useState(false);
  const player = useAtomValue(Player);
  const setRoom = useSetAtom(Room);

  const router = useRouter();
  const room = trpc.room.create.useMutation();

  const handleClick = () => {
    if (!pass.match(/^[^\s]{1,16}$/)) {
      setShowError(true);
      return;
    }
    room.mutate(
      {
        password: pass,
        playerId: player.id,
      },
      {
        onError: () => {
          setShowError(true);
        },
        onSuccess: (data) => {
          setRoom({
            id: data.id,
            ownerId: data.ownerId,
            password: data.password,
            players: data.players,
            state: data.state,
          });
          router.push("/room/create/list");
        },
      },
    );
  };

  return (
    <div className="flex h-2/3 flex-col items-center justify-center space-y-10">
      <input
        type="text"
        placeholder="合言葉を入力"
        className="h-[60px] w-[450px] rounded border-b-8 border-yellow-900 bg-yellow-500 px-2 text-center text-3xl text-white placeholder:text-white"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setPass((e.target as HTMLInputElement).value);
          setShowError(false);
        }}
      />
      <div className="flex h-[30px] items-center justify-center text-red-600">
        {showError && `「${pass}」は残念ながら爆発しました`}
      </div>
      <button
        onClick={handleClick}
        className="h-[60px] w-[200px] rounded-3xl bg-yellow-500 text-3xl text-white"
      >
        Enter
      </button>
    </div>
  );
};

export default RoomCreate;
