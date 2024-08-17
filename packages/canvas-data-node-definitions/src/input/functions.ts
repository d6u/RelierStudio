import {
  type CreateDefaultCanvasDataContext,
  NodeFunctions,
  createOutgoingCondition,
  createOutputVariable,
} from 'canvas-data-base';

import {
  type InputNodeConfig,
  type InputNodeParams,
  createDefaultInputNodeConfig,
} from './node-definition';

export const INPUT_NODE_FUNCTIONS: NodeFunctions<
  InputNodeConfig,
  InputNodeParams
> = {
  createDefaultCanvasData(context: CreateDefaultCanvasDataContext) {
    const nodeId = context.generateNodeId();

    const outgoingCondition = createOutgoingCondition({
      id: context.generateConnectorId(),
      nodeId: nodeId,
    });

    const exampleOutputVariable = createOutputVariable({
      id: context.generateConnectorId(),
      nodeId: nodeId,
      name: context.getAvailableVariableName('input argument'),
    });

    const nodeConfig = createDefaultInputNodeConfig({
      nodeId: nodeId,
      name: context.getAvailableNodeName('Input'),
      incomingConditionIds: [],
      outgoingConditionIds: [outgoingCondition.id],
      inputVariableIds: [],
      outputVariableIds: [exampleOutputVariable.id],
    });

    return {
      nodeConfigs: [nodeConfig],
      connectors: [outgoingCondition, exampleOutputVariable],
    };
  },

  async runNode(params) {
    return { variableValues: params.inputVariableValues };
  },
};
