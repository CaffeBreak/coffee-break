import { atomWithStorage } from "jotai/utils";

export const ScreenStateAtom = atomWithStorage("ScreenState", "Home-Baked");
export const PrevScreenStateAtom = atomWithStorage("PrevScreenState", "");
