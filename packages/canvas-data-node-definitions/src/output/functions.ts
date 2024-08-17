import {
  type CreateDefaultCanvasDataContext,
  NodeFunctions,
  createIncomingCondition,
  createInputVariable,
} from 'canvas-data-base';

import {
  type OutputNodeConfig,
  type OutputNodeParams,
  createDefaultOutputNodeConfig,
} from './node-definition';

export const OUTPUT_NODE_FUNCTIONS: NodeFunctions<
  OutputNodeConfig,
  OutputNodeParams
> = {
  createDefaultCanvasData(context: CreateDefaultCanvasDataContext) {
    const nodeId = context.generateNodeId();

    const incomingCondition = createIncomingCondition({
      id: context.generateConnectorId(),
      nodeId: nodeId,
    });

    const inputVariable = createInputVariable({
      id: context.generateConnectorId(),
      nodeId: nodeId,
      name: context.getAvailableVariableName('output result'),
    });

    const nodeConfig = createDefaultOutputNodeConfig({
      nodeId: nodeId,
      name: context.getAvailableNodeName('Output'),
      incomingConditionIds: [incomingCondition.id],
      outgoingConditionIds: [],
      inputVariableIds: [inputVariable.id],
      outputVariableIds: [],
    });

    return {
      nodeConfigs: [nodeConfig],
      connectors: [incomingCondition, inputVariable],
    };
  },

  async runNode(params) {
    return { variableValues: params.inputVariableValues };
  },
};
