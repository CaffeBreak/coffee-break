"use client";
import { useEffect, useState } from "react";

import { trpc, trpcSWR } from "@/utils/trpc";

// Define a proper type for your chat data
type ChatDataType = {
  message: { type: "co"; cardtype: "test" } | { type: "protect"; target: string };
  playerId: string;
  roomId?: string;
};


const IndexPage = () => {
  const roomid = "9mbhkp7jef";
  const { trigger: post } = trpcSWR.chat.create.useSWRMutation();
  const { trigger: getposts } = trpcSWR.chat.get.useSWRMutation();
  const [chatDataList, setChatDataList] = useState<ChatDataType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsData = await getposts(roomid);
      if (postsData) {
        setChatDataList(postsData);
      }
    };

    void fetchPosts();
  }, [getposts]);

  const handlerco = () => {
    void post({
      playerId: "9mzygems3j",
      message: { type: "co", cardtype: "test" },
      roomId: "9mbhkp7jef",
    });
  };
  const handlerprotect = () => {
    void post({
      message: { type: "protect", target: "9mbhkp7jef" },
      playerId: "9mbhkp7jef",
      roomId: "9mbhkp7jef",
    });
  };

  trpc.stream.chatStream.useSubscription(roomid, {
    onData: (data) => {
      console.log(data);
      setChatDataList((prevList) => [...prevList, data]);
    },
  });
  // const postss =  posts.mutate(roomid);

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
