import {
  type CreateDefaultCanvasDataContext,
  NodeFunctions,
  createIncomingCondition,
  createOutgoingCondition,
} from 'canvas-data-base';

import {
  type BareboneLoopNodeConfig,
  type BareboneLoopNodeParams,
  createDefaultBareboneLoopNodeConfdig,
} from './node-definition';

export const BAREBONE_LOOP_NODE_FUNCTIONS: NodeFunctions<
  BareboneLoopNodeConfig,
  BareboneLoopNodeParams
> = {
  createDefaultCanvasData(context: CreateDefaultCanvasDataContext) {
    const nodeId = context.generateNodeId();

    const incomingCondition = createIncomingCondition({
      id: context.generateConnectorId(),
      nodeId: nodeId,
    });

    const outgoingCondition = createOutgoingCondition({
      id: context.generateConnectorId(),
      nodeId: nodeId,
    });

    const nodeConfig = createDefaultBareboneLoopNodeConfdig({
      nodeId: nodeId,
      name: context.getAvailableNodeName('Lopp'),
      incomingConditionIds: [incomingCondition.id],
      outgoingConditionIds: [outgoingCondition.id],
      inputVariableIds: [],
      outputVariableIds: [],
    });

    return {
      nodeConfigs: [nodeConfig],
      connectors: [incomingCondition, outgoingCondition],
    };
  },

  async runNode(params) {
    return { variableValues: params.inputVariableValues };
  },
};
