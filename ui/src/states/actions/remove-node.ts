import { createDraft, finishDraft } from 'immer';

import { canvasDataAtom } from '../atoms/canvas-data';
import { canvasStore } from '../store';
import { removeNodeConfigs } from './shared-actions/remove-node-configs';

export function removeNode(nodeId: string): void {
  const canvasDataDraft = createDraft(canvasStore.get(canvasDataAtom));

  const index = canvasDataDraft.nodes.findIndex((n) => n.id === nodeId);
  canvasDataDraft.nodes.splice(index, 1);

  removeNodeConfigs(canvasDataDraft, [nodeId]);

  const canvasData = finishDraft(canvasDataDraft);
  canvasStore.set(canvasDataAtom, canvasData);
}
