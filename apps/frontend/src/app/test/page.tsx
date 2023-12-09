"use client";

import { useState } from "react";

import { trpc } from "@/utils/trpc";

const IndexPage = () => {
  const [status, setStatus] = useState("");
  // const player = trpc.player.create.useMutation();
  // const roomCreate = trpc.room.create.useMutation();
  const start = trpc.game.start.useMutation();

  const startGameHandler = () => {
    start.mutate({
      playerId: "9mzygems3j",
      roomId: "9mzygiym3k",
    });
  };
  trpc.stream.gameStream.useSubscription(undefined, {
    onData: (data) => {
      setStatus(data.phase);
    },
  });

  return (
    <div>
      <p>{status === "FINISHED" && "おわり"}</p>
      {/* <button onClick={joinRoomHandler}>join room!!</button> */}
      <button onClick={startGameHandler}>game start!!</button>
    </div>
  );
};
export default IndexPage;
