import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { PlayerStateAtom } from "@/components/atoms/PlayerState";
import { RoomStateAtom } from "@/components/atoms/RoomState";
import { PrevScreenStateAtom, ScreenStateAtom } from "@/components/atoms/ScreenState";
import { EnterButton } from "@/components/ui/button/EnterButton";
import { ErrorText } from "@/components/ui/form/ErrorText";
import { InputText } from "@/components/ui/form/InputText";
import { trpc } from "@/utils/trpc";

export const JoinRoom = () => {
  const setScreenState = useSetAtom(ScreenStateAtom);
  const setPrevScreenState = useSetAtom(PrevScreenStateAtom);
  useEffect(() => {
    setPrevScreenState("Home-SelectAction");
  }, [setPrevScreenState]);

  const playerObject = useAtomValue(PlayerStateAtom);
  const setRoomObject = useSetAtom(RoomStateAtom);
  const [password, setPassword] = useState("");

  const [showError, setShowError] = useState(false);
  const room = trpc.room.join.useMutation();

  const roomJoiningProcess = () => {
    if (!password.match(/^[^\s]{1,16}$/)) {
      setShowError(true);
      return;
    }
    room.mutate(
      { password: password, playerId: playerObject.id, roomId: playerObject.roomId },
      {
        onError: () => {
          setShowError(true);
        },
        onSuccess: (data) => {
          setRoomObject({
            id: data.id,
            ownerId: data.ownerId,
            password: data.password,
            players: data.players,
            state: data.state,
          });
          setScreenState("Home-MathcingRoom");
        },
      },
    );
  };

  return (
    <div className="flex h-full w-screen flex-col items-center justify-center">
      <div>
        <InputText
          placeholder="合言葉は？"
          onChange={setPassword}
          hideError={setShowError}
          onKeyDown={roomJoiningProcess}
        />
      </div>
      <div className="mt-[5px] h-[30px]">
        {showError && <ErrorText msg={`「${password}」は既に失われました`} />}
      </div>
      <div className="mt-[30px]">
        <EnterButton msg={"入る"} onClick={roomJoiningProcess} />
      </div>
    </div>
  );
};
