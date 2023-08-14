"use client";
import { useRouter } from "next/navigation";

interface Props {
  msg: string;
  route: string;
}

export const SelectRoom = (props: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(props.route);
  };

  return (
    <button
      onClick={handleClick}
      className="h-[60px] w-[200px] rounded-3xl border-2 border-yellow-800 bg-yellow-500 text-3xl text-white"
    >
      {props.msg}
    </button>
  );
};
