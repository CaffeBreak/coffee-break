"use client";

import { trpc } from "@/utils/trpc";

const IndexPage = () => {
  // const player = trpc.player.create.useMutation();
  // const roomCreate = trpc.room.create.useMutation();
  const start = trpc.game.start.useMutation();

  const startGameHandler = () => {
    start.mutate({
      playerId: "9mztx1whtb",
      roomId: "9mztx59ptc",
    });
  };
  trpc.stream.gameStream.useSubscription(undefined, {
    onData: () => {},
  });

  return (
    <div>
      {/* <p>{JSON.stringify(.data) || "Loading..."}</p> */}
      {/* <button onClick={joinRoomHandler}>join room!!</button> */}
      <button onClick={startGameHandler}>game start!!</button>
    </div>
  );
};
export default IndexPage;
