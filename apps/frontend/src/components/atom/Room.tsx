import { atom } from "jotai";

export const Room = atom({
  id: "",
  ownerId: "",
  password: "",
  players: [""],
  state: "",
});
