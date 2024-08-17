import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { focusAtom } from 'jotai-optics';
import type { Edge } from 'reactflow';

import { NodeKind } from 'canvas-data-base';
import type { CanvasDataV1 } from 'canvas-data-unified';

import { generateStorageKeyForCanvasData } from '../util/generate-storage-key';
import { canvasSimulatePanelSelectedStartNodeIdAtom } from './canvas-left-side-panel';
import { currentWorkflowIdAtom } from './workflows';

export const canvasDataAtom = atom<CanvasDataV1>({
  edges: [],
  nodes: [],
  nodeConfigs: {},
  connectors: {},
  globalVaribles: {},
});

canvasDataAtom.debugLabel = 'Canvas Data Atom';

let prevWorkflowId: string | null = null;

export const canvasDataEffect = atomEffect((get, set) => {
  const workflowId = get(currentWorkflowIdAtom);

  if (workflowId == null) {
    prevWorkflowId = null;
    return;
  }

  const canvasDataKey = generateStorageKeyForCanvasData(workflowId);

  /**
   * NOTE: Must establish the dependency on the canvasDataAtom for both cases
   * below.
   */
  let canvasData = get(canvasDataAtom);

  if (prevWorkflowId === workflowId) {
    /**
     * NOTE: This is when canvasData change, we need to save it to localStorage.
     */

    localStorage.setItem(canvasDataKey, JSON.stringify(canvasData));
    return;
  }

  /**
   * NOTE: When the flow ID changes, we need to reload canvas data from
   * localStorage.
   */

  prevWorkflowId = workflowId;

  const canvasDataJsonString = localStorage.getItem(canvasDataKey);

  if (canvasDataJsonString == null || canvasDataJsonString === '') {
    canvasData = {
      edges: [],
      nodes: [],
      nodeConfigs: {},
      connectors: {},
      globalVaribles: {},
    };
    localStorage.setItem(canvasDataKey, JSON.stringify(canvasData));
  } else {
    canvasData = JSON.parse(canvasDataJsonString);
  }

  set(canvasDataAtom, canvasData);
});

export const canvasEdgesAtom = focusAtom(canvasDataAtom, (optic) =>
  optic.prop('edges'),
);

export const canvasNodesAtom = focusAtom(canvasDataAtom, (optic) =>
  optic.prop('nodes'),
);

export const canvasNodeConfigsAtom = focusAtom(canvasDataAtom, (optic) =>
  optic.prop('nodeConfigs'),
);

export const canvasConnectorsAtom = focusAtom(canvasDataAtom, (optic) =>
  optic.prop('connectors'),
);

export const canvasGlobalVariablesAtom = focusAtom(canvasDataAtom, (optic) =>
  optic.prop('globalVaribles'),
);

export const selectFinishNodeIdsAtom = atom<string[]>((get) => {
  const simulatePanelSelectedStartNodeId = get(
    canvasSimulatePanelSelectedStartNodeIdAtom,
  );
  const edges = get(canvasEdgesAtom) as Edge[];
  const nodeConfigs = get(canvasNodeConfigsAtom);

  if (simulatePanelSelectedStartNodeId == null) {
    return [];
  }

  const finishNodeIds = new Set<string>();

  const queue = [simulatePanelSelectedStartNodeId];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;

    const outgoingEdges = edges.filter(
      (edge) => edge.source === nodeId && !edge.hidden,
    );

    if (outgoingEdges.length === 0) {
      if (nodeConfigs[nodeId].kind === NodeKind.Finish) {
        finishNodeIds.add(nodeId);
      }
    } else {
      for (const edge of outgoingEdges) {
        queue.push(edge.target);
      }
    }
  }

  return Array.from(finishNodeIds);
});
