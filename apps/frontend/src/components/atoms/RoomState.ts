import { atomWithStorage } from "jotai/utils";

export const RoomStateAtom = atomWithStorage("RoomState", {
  id: "",
  ownerId: "",
  password: "",
  players: [""],
  state: "",
});
