import { createDraft, finishDraft } from 'immer';
import type { ReactFlowInstance, useStoreApi } from 'reactflow';

import {
  type CreateDefaultCanvasDataContext,
  NodeConfigFieldType,
  type NodeConfigInputVariableFieldConfig,
  NodeDefinitionConfigSectionKind,
  createInputVariable,
} from 'canvas-data-base';
import {
  NODE_DEFINITIONS,
  NODE_FUNCTIONS,
  type NodeConfig,
  type NodeType,
} from 'canvas-data-unified';
import randomId from 'common-utils/randomId';

import { canvasDataAtom } from '../atoms/canvas-data';
import { canvasStore } from '../store';
import {
  getAvailableNodeName,
  getAvailableVariableName,
} from '../util/get-available-util';
import { addNewCanvasHistory } from './canvas-history';
import { updateNodeConfigInputVariableIds } from './shared-actions/update-node-config-connector-ids-field';

const CREATE_DEFAULT_CANVAS_DATA_CONTEXT: CreateDefaultCanvasDataContext = {
  generateNodeId: () => randomId(),
  generateConnectorId: () => randomId(),
  getAvailableVariableName: getAvailableVariableName,
  getAvailableNodeName: getAvailableNodeName,
};

export function addNodeToCenterOfCanvas(
  nodeType: NodeType,
  reactFlow: ReactFlowInstance,
  reactFlowStoreApi: ReturnType<typeof useStoreApi>,
) {
  /**
   * NOTE: Create draft
   */

  const canvasDataDraft = createDraft(canvasStore.get(canvasDataAtom));

  /**
   * NOTE: Perform action
   */

  const nodeFuncs = NODE_FUNCTIONS[nodeType];

  const { nodeConfigs, connectors } = nodeFuncs.createDefaultCanvasData(
    CREATE_DEFAULT_CANVAS_DATA_CONTEXT,
  );

  const viewport = reactFlow.getViewport();
  const reactFlowState = reactFlowStoreApi.getState();
  const canvasRect = reactFlowState.domNode!.getBoundingClientRect();

  const p1 = reactFlow.screenToFlowPosition({
    x: canvasRect.x,
    y: canvasRect.y,
  });
  const p2 = reactFlow.screenToFlowPosition({
    x: canvasRect.x + canvasRect.width,
    y: canvasRect.y + canvasRect.height,
  });

  const newNodes = nodeConfigs.map((nodeConfig) => {
    /**
     * The viewport object's x and y are equal to origin's minus the
     * current viewport's top left corner point. We need to translate
     * viewport object's x and y back the corner point.
     */
    let x = -viewport.x + (p2.x - p1.x) / 2;
    let y = -viewport.y + (p2.y - p1.y) / 2;

    // Make sure the node is not overlapping with any other nodes
    while (
      canvasDataDraft.nodes.some(
        (node) => node.position.x === x && node.position.y === y,
      )
    ) {
      x += 20;
      y += 20;
    }

    return {
      id: nodeConfig.nodeId,
      position: { x, y },
    };
  });

  canvasDataDraft.nodes.push(...newNodes);

  nodeConfigs.forEach((nodeConfig: NodeConfig) => {
    canvasDataDraft.nodeConfigs[nodeConfig.nodeId] = nodeConfig;

    /**
     * NOTE: Handle InputVariable field config
     */
    let hasInputVariableField = false;
    const nodeDef = NODE_DEFINITIONS[nodeConfig.type];
    for (const section of nodeDef.sections) {
      if (section.kind === NodeDefinitionConfigSectionKind.UI) {
        continue;
      }

      const fieldDef = section.options[0];
      if (fieldDef.type === NodeConfigFieldType.InputVariable) {
        hasInputVariableField = true;

        const fieldConfig = nodeConfig.fields[section.key]
          .configs[0] as NodeConfigInputVariableFieldConfig;

        const variable = createInputVariable({
          id: randomId(),
          nodeId: nodeConfig.nodeId,
          name: fieldDef.defaultVariableName ?? section.key,
        });

        canvasDataDraft.connectors[variable.id] = variable;

        fieldConfig.variableId = variable.id;
      }
    }

    /**
     * NOTE: Always update the inputVariableIds
     */
    if (hasInputVariableField) {
      updateNodeConfigInputVariableIds(canvasDataDraft, nodeConfig.nodeId);
    }
  });

  connectors.forEach((connector) => {
    canvasDataDraft.connectors[connector.id] = connector;
  });

  /**
   * NOTE: Apply draft
   */

  const canvasData = finishDraft(canvasDataDraft, (patches, inversePatches) => {
    addNewCanvasHistory(patches, inversePatches);
  });

  canvasStore.set(canvasDataAtom, canvasData);
}
