import { atomWithStorage } from "jotai/utils";

export const RoomStateAtom = atomWithStorage<{
  id: string;
  ownerId: string;
  phase: string;
  password: string;
  players: {
    name: string;
    status: "ALIVE" | "DEAD";
    id: string;
    role: "VILLAGER" | "WEREWOLF" | "PENDING";
  }[];
  day: number;
  winner: "VILLAGER" | "WEREWOLF" | undefined;
}>("RoomState", {
  id: "",
  ownerId: "",
  phase: "",
  password: "",
  players: [
    {
      name: "",
      status: "ALIVE",
      id: "",
      role: "PENDING",
    },
  ],
  day: 0,
  winner: undefined,
});
