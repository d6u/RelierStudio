import { type Patch, applyPatches, produce } from 'immer';

import { canvasDataAtom } from '../atoms/canvas-data';
import { canvasUndoHistoriesAtom } from '../atoms/canvas-undo-histories';
import { canvasStore } from '../store';

export function addNewCanvasHistory(
  patches: Patch[] = [],
  inversePatches: Patch[] = [],
) {
  console.debug('addNewCanvasHistory patches', patches);
  console.debug('addNewCanvasHistory inversePatches', inversePatches);

  // canvasStore.set(canvasUndoHistoriesAtom, (prev) => {
  //   return produce(prev, (draft) => {
  //     if (draft.pointerIndex < draft.patchesHistory.length - 1) {
  //       /**
  //        * NOTE: If there is an redo stack, throw away the redo because of
  //        * the new stach.
  //        */
  //       draft.pointerIndex += 1;

  //       if (patches.length === 0) {
  //         draft.patchesHistory.splice(draft.pointerIndex);
  //         draft.inversePatchesHistory.splice(draft.pointerIndex);
  //       } else {
  //         draft.patchesHistory.splice(draft.pointerIndex, Infinity, [patches]);
  //         draft.inversePatchesHistory.splice(draft.pointerIndex, Infinity, [
  //           inversePatches,
  //         ]);
  //       }
  //     } else {
  //       draft.pointerIndex += 1;

  //       if (patches.length === 0) {
  //         draft.patchesHistory.push([]);
  //         draft.inversePatchesHistory.push([]);
  //       } else {
  //         draft.patchesHistory.push([patches]);
  //         draft.inversePatchesHistory.push([inversePatches]);
  //       }
  //     }
  //   });
  // });
}

export function addPatchesToHistory(patches: Patch[], inversePatches: Patch[]) {
  console.debug('addPatchesToHistory patches', patches);
  console.debug('addPatchesToHistory inversePatches', inversePatches);

  // if (patches.length === 0) {
  //   return;
  // }

  // canvasStore.set(canvasUndoHistoriesAtom, (prev) => {
  //   return produce(prev, (draft) => {
  //     draft.patchesHistory[draft.pointerIndex].push(patches);
  //     draft.inversePatchesHistory[draft.pointerIndex].push(inversePatches);
  //   });
  // });
}

export function undo() {
  const { pointerIndex, inversePatchesHistory } = canvasStore.get(
    canvasUndoHistoriesAtom,
  );

  if (pointerIndex < 0) {
    return;
  }

  let canvasData = canvasStore.get(canvasDataAtom);

  const patchGroup = inversePatchesHistory[pointerIndex];

  for (let i = patchGroup.length - 1; i >= 0; i--) {
    const patches = patchGroup[i];
    console.debug('patches', patches);
    canvasData = applyPatches(canvasData, patches);
  }

  canvasStore.set(canvasDataAtom, canvasData);

  console.debug('undo result', canvasStore.get(canvasDataAtom));

  canvasStore.set(canvasUndoHistoriesAtom, (prev) => {
    return produce(prev, (draft) => {
      draft.pointerIndex -= 1;
    });
  });
}

export function redo() {
  const { pointerIndex, patchesHistory } = canvasStore.get(
    canvasUndoHistoriesAtom,
  );

  if (pointerIndex === patchesHistory.length - 1) {
    return;
  }

  let canvasData = canvasStore.get(canvasDataAtom);

  const patchGroup = patchesHistory[pointerIndex + 1];

  for (let i = 0; i < patchGroup.length; i++) {
    const patches = patchGroup[i];
    console.debug('patches', patches);
    canvasData = applyPatches(canvasData, patches);
  }

  canvasStore.set(canvasDataAtom, canvasData);

  canvasStore.set(canvasUndoHistoriesAtom, (prev) => {
    return produce(prev, (draft) => {
      draft.pointerIndex += 1;
    });
  });
}
