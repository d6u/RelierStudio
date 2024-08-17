import {
  type CreateDefaultCanvasDataContext,
  NodeFunctions,
  createIncomingCondition,
  createInputVariable,
  createOutgoingCondition,
  createOutputVariable,
} from 'canvas-data-base';

import {
  type JsonToStringNodeConfig,
  type JsonToStringNodeParams,
  createDefaultJsonToStringNodeConfig,
} from './node-definition';

export const JSON_TO_STRING_NODE_FUNCTIONS: NodeFunctions<
  JsonToStringNodeConfig,
  JsonToStringNodeParams
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

    const inputVariable = createInputVariable({
      id: context.generateConnectorId(),
      nodeId: nodeId,
      name: 'input',
    });

    const outputVariable = createOutputVariable({
      id: context.generateConnectorId(),
      nodeId: nodeId,
      name: 'output',
    });

    const nodeConfig = createDefaultJsonToStringNodeConfig({
      nodeId: nodeId,
      name: context.getAvailableNodeName('JSON to String'),
      incomingConditionIds: [incomingCondition.id],
      outgoingConditionIds: [outgoingCondition.id],
      inputVariableIds: [inputVariable.id],
      outputVariableIds: [outputVariable.id],
    });

    return {
      nodeConfigs: [nodeConfig],
      connectors: [
        incomingCondition,
        outgoingCondition,
        inputVariable,
        outputVariable,
      ],
    };
  },

  async runNode(params) {
    const input = params.nodeParams.input;
    const result = JSON.stringify(input);
    return { variableValues: [result] };
  },
};
