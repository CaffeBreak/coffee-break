"use client";

import { useEffect, useState } from "react";

import { apiClient } from "@/scripts/apiClient";

export default function Home() {
  const [msg, setMsg] = useState("loading");

  useEffect(() => {
    apiClient.$get().then((res) => setMsg(res.msg));
  }, []);

  return <span>{msg}</span>;
}
