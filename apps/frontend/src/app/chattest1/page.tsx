"use client";
import { useState } from "react";



import { trpc } from "@/utils/trpc";

const IndexPage = () => {
  const roomid = "9mbhkp7jef";
  const post = trpc.chat.create.useMutation();
  const [chatDataList, setChatDataList] = useState<
  { message: { type: "co"; cardtype: "test" } | { type: "protect"; target: string }; playerId: string; roomId?: string | undefined }[]
  >([]);
  const handlerco = () => {
    post.mutate({
      message: { type: "co", cardtype: "test" },
      playerid: "9mbhkp7jef",
      roomId: "9mbhkp7jef",
    });
  };
  const handlerprotect = () => {
    post.mutate({
      message: { type: "protect", target: "9mbhkp7jef" },
      playerid: "9mbhkp7jef",
      roomId: "9mbhkp7jef",
    });
  };
  trpc.stream.chatStream.useSubscription(roomid, {
    onData: (data) => {
      console.log(data);
      setChatDataList((prevList) => [...prevList, data]);
    },
  });

  return (
    <div>
      {/* <p>{JSON.stringify(.data) || "Loading..."}</p> */}
      <button onClick={handlerco}>click me co!!</button>
      <button onClick={handlerprotect}>click me protect!!</button>
      {chatDataList.map((chatData, index) => (
        <p key={index}>{`Player: ${chatData.playerId}, roomID: ${chatData.roomId}, Message: ${JSON.stringify(chatData.message)}`}</p>
      ))}
    </div>
  );
};
export default IndexPage;
