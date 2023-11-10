"use client";

import { trpc } from "@/utils/trpc";

const IndexPage = () => {
  const player = trpc.player.create.useMutation();
  const handler = () => {
    player.mutate({
      name: "aaaa",
    });
  };

  return (
    <div>
      <p>{JSON.stringify(player.data) || "Loading..."}</p>
      <button onClick={handler}>click me!!</button>
    </div>
  );
};
export default IndexPage;
