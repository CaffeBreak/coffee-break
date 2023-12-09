import { atomWithStorage } from "jotai/utils";

export const RoomStateAtom = atomWithStorage("RoomState", {
  id: "",
  ownerId: "",
  phase: "",
  password: "",
  players: [
    {
      name: "",
      status: "",
      id: "",
      role: "",
    },
  ],
  day: 0,
});
