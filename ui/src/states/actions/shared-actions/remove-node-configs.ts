import { type Draft } from 'immer';

import type { CanvasDataV1 } from 'canvas-data-unified';

import { removeConnectors } from './remove-connectors';

export function removeNodeConfigs(
  canvasDataDraft: Draft<CanvasDataV1>,
  nodeIds: string[],
): void {
  const removingConnectorIds = Object.values(canvasDataDraft.connectors)
    .filter((connector) => nodeIds.includes(connector.nodeId))
    .map((connector) => connector.id);

  for (const nodeId of nodeIds) {
    delete canvasDataDraft.nodeConfigs[nodeId];
  }

  removeConnectors(canvasDataDraft, removingConnectorIds);
}
