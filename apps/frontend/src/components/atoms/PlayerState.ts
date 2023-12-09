import { atomWithStorage } from "jotai/utils";

export const PlayerStateAtom = atomWithStorage("PlayerState", {
  id: "",
  name: "",
  role: "",
  status: "",
  roomId: "",
});
