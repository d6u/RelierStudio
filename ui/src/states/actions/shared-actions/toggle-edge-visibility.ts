import { type Draft } from 'immer';
import type { Edge } from 'reactflow';

import { ConnectorType } from 'canvas-data-base';
import type { CanvasDataV1 } from 'canvas-data-unified';

export function toggleEdgeVisibilityOnInputVariableIdsChange(
  canvasDataDraft: Draft<CanvasDataV1>,
  nodeId: string,
) {
  const nodeConfig = canvasDataDraft.nodeConfigs[nodeId];
  const inputVariableIdSet = new Set(nodeConfig.inputVariableIds);

  canvasDataDraft.edges.forEach((edge) => {
    if (
      edge.target !== nodeConfig.nodeId ||
      canvasDataDraft.connectors[edge.targetHandle].type !==
        ConnectorType.InputVariable
    ) {
      return;
    }

    (edge as Edge).hidden = !inputVariableIdSet.has(edge.targetHandle);
  });
}
