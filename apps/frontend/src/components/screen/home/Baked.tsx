import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { PlayerStateAtom } from "@/components/atoms/PlayerState";
import { PrevScreenStateAtom, ScreenStateAtom } from "@/components/atoms/ScreenState";
import { EnterButton } from "@/components/ui/button/EnterButton";
import { ErrorText } from "@/components/ui/form/ErrorText";
import { InputText } from "@/components/ui/form/InputText";
import { trpc } from "@/utils/trpc";

export const Baked = () => {
  const setScreenState = useSetAtom(ScreenStateAtom);
  const setPrevScreenState = useSetAtom(PrevScreenStateAtom);
  useEffect(() => {
    setPrevScreenState("");
  }, [setPrevScreenState]);

  const [playerObject, setPlayerObject] = useAtom(PlayerStateAtom);
  const [name, setName] = useState("");
  useEffect(() => {
    setName(playerObject.name);
  }, [playerObject]);

  const [showError, setShowError] = useState(false);
  const player = trpc.player.create.useMutation();

  const bakingProcess = () => {
    if (!name.match(/^[^\s]{1,16}$/)) {
      setShowError(true);
      return;
    }
    player.mutate(
      { name: name },
      {
        onError: () => {
          setShowError(true);
        },
        onSuccess: (data) => {
          setPlayerObject({
            id: data.id,
            name: data.name,
            role: data.role,
            status: data.status,
            roomId: data.roomId as string,
          });
          setScreenState("Home-SelectAction");
        },
      },
    );
  };

  return (
    <div className="flex w-screen flex-col items-center">
      <div className="mt-[70px]">
        <div className="my-2 mr-[130px] font-serif text-8xl italic">Caffe</div>
        <div className="my-2 ml-[130px] font-serif text-8xl italic">Break</div>
      </div>

      <div className="mt-[70px]">
        <InputText
          value={name}
          onChange={setName}
          hideError={setShowError}
          onKeyDown={bakingProcess}
        />
      </div>
      <div className="mt-[5px] h-[30px]">
        {showError && <ErrorText msg={`「${name}」は残念ながら炭になりました`} />}
      </div>
      <div className="mt-[30px]">
        <EnterButton msg={"焼きあがる"} onClick={bakingProcess} />
      </div>
    </div>
  );
};
