"use client";
import { trpc } from "@/utils/trpc";

const IndexPage = () => {
  const post = trpc.chat.create.useMutation();
  const handler = () => {
    post.mutate({
      message: { type: "co", cardtype: "test" },
      playerid: "9mbhkp7jez",
      roomId: "9mbhkp7jez",
    });
  };
  trpc.stream.chatStream.useSubscription(undefined, {
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
