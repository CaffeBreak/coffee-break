"use client";

import { useAtomValue } from "jotai";

import { Player } from "@/components/atom/Player";
import { trpc } from "@/utils/trpc";

const IndexPage = () => {
  const player = useAtomValue(Player);
  console.log(player.id);

  const room = trpc.room.create.useMutation();
  const handler = () => {
    room.mutate({
      password: "aaa",
      ownerId: "aaaaaaaaaa",
    });
  };

  return (
    <div>
      <p>{JSON.stringify(room.data) || "Loading..."}</p>
      <button onClick={handler}>click me!!</button>
    </div>
  );
};
export default IndexPage;
