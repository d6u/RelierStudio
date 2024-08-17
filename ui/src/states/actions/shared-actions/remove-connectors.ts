import { type Draft } from 'immer';

import type { CanvasDataV1 } from 'canvas-data-unified';

import { removeEdges } from './remove-edges';

export function removeConnectors(
  canvasDataDraft: Draft<CanvasDataV1>,
  connectorIds: string[],
) {
  const removingEdgeIds: string[] = canvasDataDraft.edges
    .filter(
      (edge) =>
        connectorIds.includes(edge.sourceHandle) ||
        connectorIds.includes(edge.targetHandle),
    )
    .map((edge) => edge.id);

  for (const connectorId of connectorIds) {
    delete canvasDataDraft.connectors[connectorId];
  }

  removeEdges(canvasDataDraft, removingEdgeIds);
}
