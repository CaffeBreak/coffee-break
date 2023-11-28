"use client";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Player } from "@/components/atom/Player";
import { trpc } from "@/utils/trpc";

const Home = () => {
  const player = trpc.player.create.useMutation();
  const router = useRouter();

  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const setPlayer = useSetAtom(Player);

  const handleClick = () => {
    player.mutate(
      {
        name: name,
      },
      {
        onError: () => {
          setShowError(true);
        },
        onSuccess: (data) => {
          setPlayer({
            id: data.id,
            name: data.name,
            role: data.role,
            status: data.status,
            roomId: "",
          });
        },
      },
    );
  };

  useEffect(() => {
    if (player.data) {
      console.log(player.data);
      router.push("/room");
    }
  }, [player, router]);

  return (
    <>
      <div className="my-[70px] flex w-full flex-col items-center justify-center">
        <div className="my-2 mr-[130px] font-serif text-8xl italic">Caffe</div>
        <div className="my-2 ml-[130px] font-serif text-8xl italic">Break</div>
      </div>
      <div className="flex w-full justify-center">
        <input
          type="text"
          placeholder="名前を入力"
          className="h-[60px] w-[450px] rounded border-b-8 border-yellow-900 bg-yellow-500 px-2 text-center text-3xl text-white placeholder:text-white"
          onChange={(event) => {
            setName(event.target.value);
            setShowError(false);
          }}
        />
      </div>
      <div className="flex h-[30px] items-center justify-center text-red-600">
        {showError && `「${name}」は残念ながら炭になりました`}
      </div>
      <div className="mt-[40px] flex w-full justify-center">
        <button
          onClick={handleClick}
          className="h-[60px] w-[200px] rounded-3xl bg-yellow-500 text-3xl text-white"
        >
          焼きあがる
        </button>
      </div>
    </>
  );
};

export default Home;
