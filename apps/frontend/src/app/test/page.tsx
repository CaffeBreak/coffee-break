"use client";

import { trpc } from "@/utils/trpc";

const IndexPage = () => {
  const start = trpc.game.start.useMutation();
  const handler = () => {
    start.mutate({
      playerId: "9mbhkp7jez",
      roomId: "9mbhkp7jez",
    });
  };
  trpc.stream.gameStream.useSubscription(undefined, {
    onData: () => {},
  });

  return (
    <div>
      {/* <p>{JSON.stringify(.data) || "Loading..."}</p> */}
      <button onClick={handler}>click me!!</button>
    </div>
  );
};
export default IndexPage;
