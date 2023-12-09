import { useAtomValue } from "jotai";

import { RoomStateAtom } from "@/components/atoms/RoomState";

export const ViewRole = () => {
  const roomObject = useAtomValue(RoomStateAtom);

  return (
    <div>
      <div>{roomObject.phase}</div>
    </div>
  );
};
