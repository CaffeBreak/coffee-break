"use client";
import { trpc } from "@/utils/trpc";

const IndexPage = () => {
  const post = trpc.chat.create.useMutation();
  const handlerco = () => {
    post.mutate({
      message: { type: "co", cardtype: "test" },
      playerid: "9mbhkp7jez",
      roomId: "9mbhkp7jez",
    });
  };
  const handlerprotect = () => {
    post.mutate({
      message: { type: "protect", target: "9mbhkp7jez" },
      playerid: "9mbhkp7jez",
      roomId: "9mbhkp7jez",
    });
  };
  trpc.stream.chatStream.useSubscription(undefined, {
    onData: (data) => {
      console.log(data);
    },
  });

  return (
    <div>
      {/* <p>{JSON.stringify(.data) || "Loading..."}</p> */}
      <button onClick={handlerco}>click me co!!</button>
      <button onClick={handlerprotect}>click me protect!!</button>
    </div>
  );
};
export default IndexPage;
