"use client";

import { useEffect, useState } from "react";

import { apiClient } from "@/scripts/apiClient";

const Home = () => {
  const [msg, setMsg] = useState("loading");

  // このコード適当に書いたけどAPIとの通信が発生するなら<Suspense>を使うべき
  useEffect(() => {
    apiClient
      .$get()
      .then((res) => setMsg(res.msg))
      .catch(() => "could not fetch data");
  }, []);

  return <span>{msg}</span>;
};

export default Home;
