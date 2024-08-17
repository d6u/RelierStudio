import { type Draft } from 'immer';

import type { CanvasDataV1 } from 'canvas-data-unified';

export function removeEdges(
  canvasDataDraft: Draft<CanvasDataV1>,
  edgeIds: string[],
) {
  canvasDataDraft.edges = canvasDataDraft.edges.filter(
    (edge) => !edgeIds.includes(edge.id),
  );
}
