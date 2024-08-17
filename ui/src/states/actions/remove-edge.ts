import { createDraft, finishDraft } from 'immer';

import { canvasDataAtom } from '../atoms/canvas-data';
import { canvasStore } from '../store';
import { removeEdges } from './shared-actions/remove-edges';

export function removeEdge(edgeId: string): void {
  const canvasDataDraft = createDraft(canvasStore.get(canvasDataAtom));

  removeEdges(canvasDataDraft, [edgeId]);

  const canvasData = finishDraft(canvasDataDraft);
  canvasStore.set(canvasDataAtom, canvasData);
}
