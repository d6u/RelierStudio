import {
  type CreateDefaultCanvasDataContext,
  NodeFunctions,
  createOutgoingCondition,
} from 'canvas-data-base';

import {
  type LoopStartNodeConfig,
  type LoopStartNodeParams,
  createDefaultLoopStartNodeConfig,
} from './node-definition';

export const LOOP_START_NODE_FUNCTIONS: NodeFunctions<
  LoopStartNodeConfig,
  LoopStartNodeParams
> = {
  createDefaultCanvasData(context: CreateDefaultCanvasDataContext) {
    const nodeId = context.generateNodeId();

    const outgoingCondition = createOutgoingCondition({
      id: context.generateConnectorId(),
      nodeId: nodeId,
    });

    const nodeConfig = createDefaultLoopStartNodeConfig({
      nodeId: nodeId,
      name: 'Loop start 1',
      incomingConditionIds: [],
      outgoingConditionIds: [outgoingCondition.id],
      inputVariableIds: [],
      outputVariableIds: [],
    });

    return {
      nodeConfigs: [nodeConfig],
      connectors: [outgoingCondition],
    };
  },

  async runNode(params) {
    return { variableValues: params.inputVariableValues };
  },
};
