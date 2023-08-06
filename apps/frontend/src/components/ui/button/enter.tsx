"use client";
import { useRouter } from "next/navigation";

export const Enter = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/room");
  };

  return (
    <button
      onClick={handleClick}
      className="h-[60px] w-[200px] rounded-3xl bg-yellow-500 text-3xl text-white"
    >
      Enter
    </button>
  );
};
