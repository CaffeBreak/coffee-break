import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { PlayerStateAtom } from "@/components/atoms/PlayerState";
import { RoomStateAtom } from "@/components/atoms/RoomState";
import { PrevScreenStateAtom, ScreenStateAtom } from "@/components/atoms/ScreenState";
import { RoomControlButton } from "@/components/ui/button/RoomControlButton";
import { trpc } from "@/utils/trpc";

export const MathcingRoom = () => {
  const setScreenState = useSetAtom(ScreenStateAtom);
  const setPrevScreenState = useSetAtom(PrevScreenStateAtom);
  useEffect(() => {
    setPrevScreenState("");
  }, [setPrevScreenState]);

  const playerObject = useAtomValue(PlayerStateAtom);
  const [roomObject, setRoomObject] = useAtom(RoomStateAtom);
  const [roomOwner, setRoomOwner] = useState(true);
  useEffect(() => {
    playerObject.id === roomObject.ownerId ? setRoomOwner(true) : setRoomOwner(false);
  }, [playerObject.id, roomObject.ownerId]);

  const deleteRoom = trpc.room.delete.useMutation();
  const leaveRoom = trpc.room.leave.useMutation();
  const startGame = trpc.game.start.useMutation();

  const roomDeletingProcess = () => {
    deleteRoom.mutate(
      { playerId: playerObject.id, roomId: roomObject.id },
      {
        onSuccess: () => {
          setScreenState("Home-SelectAction");
        },
      },
    );
  };

  const roomLeavingProcess = () => {
    leaveRoom.mutate(
      { playerId: playerObject.id },
      {
        onSuccess: () => {
          setScreenState("Home-SelectAction");
        },
      },
    );
  };

  const gameStartingProcess = () => {
    startGame.mutate({ playerId: playerObject.id, roomId: roomObject.id });
  };

  trpc.stream.gameStream.useSubscription(undefined, {
    onData: (data) => {
      if (data.eventType === "roomUpdate") {
        setRoomObject(data);
      } else if (data.phase === "DISCUSSION") {
        setRoomObject((prev) => ({ ...prev, phase: data.phase, day: data.day }));
        setScreenState("Game-ViewRole");
      }
    },
  });

  return (
    <div className="mt-[70px] flex w-screen items-center">
      <div className="mx-2 flex w-1/2 min-w-[250px] flex-col items-center space-y-2">
        <div>
          {roomOwner && (
            <RoomControlButton
              msg="部屋を燃やす"
              color="bg-red-500"
              onClick={roomDeletingProcess}
            />
          )}
          {!roomOwner && (
            <RoomControlButton
              msg="部屋から逃げる"
              color="bg-red-500"
              onClick={roomLeavingProcess}
            />
          )}
        </div>
        <div className="flex h-[140px] w-[250px] flex-col items-center justify-center space-y-2 rounded border-2 border-yellow-800 text-2xl">
          <div>部屋の合言葉</div>
          <div className="border-b-2 border-yellow-800">{roomObject.password}</div>
          <div className="border-b-2 border-yellow-800">{`人数 ${roomObject.players.length}/7`}</div>
        </div>
        <div>
          {roomOwner && (
            <RoomControlButton
              msg="カフェを始める"
              color="bg-yellow-500"
              onClick={gameStartingProcess}
            />
          )}
        </div>
      </div>
      <div className="mx-2 flex w-1/2 min-w-[350px] flex-col items-center space-y-2">
        {roomObject.players.map((player, index) => (
          <div key={index} className="w-[350px] rounded-3xl border-2 border-yellow-800 px-2 py-1">
            {player.name}
          </div>
        ))}
      </div>
    </div>
  );
};
