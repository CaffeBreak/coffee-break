import { useAtomValue } from "jotai";

import { PlayerStateAtom } from "@/components/atoms/PlayerState";
import { RoomStateAtom } from "@/components/atoms/RoomState";
import { trpc } from "@/utils/trpc";

interface Props {
  vote: string;
}

export const VoteButton = (props: Props) => {
  const voting = trpc.game.vote.useMutation();
  const skipPhase = trpc.game.skipPhase.useMutation();

  const player = useAtomValue(PlayerStateAtom);
  const roomObject = useAtomValue(RoomStateAtom);
  if (roomObject.phase !== "DISCUSSION" && roomObject.phase !== "VOTING") return <div></div>;

  const handleVote = () => {
    if (roomObject.phase === "DISCUSSION") {
      skipPhase.mutate({ playerId: player.id });
    } else if (roomObject.phase === "VOTING" && props.vote !== "") {
      voting.mutate({ playerId: player.id, target: props.vote });
    } else alert("処刑対象を選択しなさい");
  };

  const buttonText = roomObject.phase === "DISCUSSION" ? "議論終了" : "処刑する人";

  return (
    <button
      className="h-[110px] w-[200px] rounded-3xl bg-yellow-500 text-center text-xl text-white"
      onClick={() => handleVote()}
    >
      {buttonText}
      <div>に投票する</div>
    </button>
  );
};
