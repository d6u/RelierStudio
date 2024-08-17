import type { Patch } from 'immer';
import { atom } from 'jotai';

export const canvasUndoHistoriesAtom = atom<{
  pointerIndex: number;
  patchesHistory: Patch[][][];
  inversePatchesHistory: Patch[][][];
}>({
  pointerIndex: -1,
  patchesHistory: [],
  inversePatchesHistory: [],
});
