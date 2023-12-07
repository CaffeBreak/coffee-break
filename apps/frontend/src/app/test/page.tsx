"use client";

import { useAtomValue } from "jotai";

import { Player } from "@/components/atom/Player";
import { trpc } from "@/utils/trpc";

const IndexPage = () => {
  const player = useAtomValue(Player);
  console.log(player.id);

  const start = trpc.game.start.useMutation();
  const handler = () => {
    start.mutate({
      playerId: "9mbhkp7jez",
      roomId: "9mbhkp7jez",
    });
  };
  trpc.game.gameStream.useSubscription(undefined, {
    onData(data) {
      console.log(data);
    },
  });

  return (
    <div>
      {/* <p>{JSON.stringify(.data) || "Loading..."}</p> */}
      <button onClick={handler}>click me!!</button>
    </div>
  );
};
export default IndexPage;
