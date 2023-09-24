"use client";
import { useRouter } from "next/navigation";

interface Props {
  dest: string;
}
export const Enter = (props: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(props.dest);
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
