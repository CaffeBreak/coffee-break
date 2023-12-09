import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { PlayerStateAtom } from "@/components/atoms/PlayerState";
import { RoomStateAtom } from "@/components/atoms/RoomState";
import { PrevScreenStateAtom, ScreenStateAtom } from "@/components/atoms/ScreenState";
import { EnterButton } from "@/components/ui/button/EnterButton";
import { ErrorText } from "@/components/ui/form/ErrorText";
import { InputText } from "@/components/ui/form/InputText";
import { trpc } from "@/utils/trpc";

export const CreateRoom = () => {
  const setScreenState = useSetAtom(ScreenStateAtom);
  const setPrevScreenState = useSetAtom(PrevScreenStateAtom);
  useEffect(() => {
    setPrevScreenState("Home-SelectAction");
  }, [setPrevScreenState]);

  const playerObject = useAtomValue(PlayerStateAtom);
  const setRoomObject = useSetAtom(RoomStateAtom);
  const [password, setPassword] = useState("");

  const [showError, setShowError] = useState(false);
  const room = trpc.room.create.useMutation();

  const roomCreatingProcess = () => {
    if (!password.match(/^[^\s]{1,16}$/)) {
      setShowError(true);
      return;
    }
    room.mutate(
      { password: password, playerId: playerObject.id },
      {
        onError: () => {
          setShowError(true);
        },
        onSuccess: (data) => {
          setRoomObject({
            id: data.id,
            ownerId: data.ownerId,
            phase: data.phase,
            password: data.password,
            players: data.players,
            day: data.day,
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
          placeholder="合言葉を決める"
          onChange={setPassword}
          hideError={setShowError}
          onKeyDown={roomCreatingProcess}
        />
      </div>
      <div className="mt-[5px] h-[30px]">
        {showError && <ErrorText msg={`「${password}」は大破・炎上・解体されました`} />}
      </div>
      <div className="mt-[30px]">
        <EnterButton msg={"作る"} onClick={roomCreatingProcess} />
      </div>
    </div>
  );
};
