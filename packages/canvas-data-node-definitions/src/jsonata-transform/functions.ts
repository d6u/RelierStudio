import jsonata from 'jsonata';

import {
  type CreateDefaultCanvasDataContext,
  NodeFunctions,
  createIncomingCondition,
  createInputVariable,
  createOutgoingCondition,
  createOutputVariable,
} from 'canvas-data-base';

import {
  type JsonataTransformNodeConfig,
  type JsonataTransformNodeParams,
  createDefaultJsonataTransformNodeConfig,
} from './node-definition';

export const JSONATA_TRANSFORM_NODE_FUNCTIONS: NodeFunctions<
  JsonataTransformNodeConfig,
  JsonataTransformNodeParams
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
      name: 'input1',
    });

    const outputVariable = createOutputVariable({
      id: context.generateConnectorId(),
      nodeId: nodeId,
      name: 'result',
    });

    const nodeConfig = createDefaultJsonataTransformNodeConfig({
      nodeId: nodeId,
      name: context.getAvailableNodeName('Transform'),
      incomingConditionIds: [incomingCondition.id],
      outgoingConditionIds: [outgoingCondition.id],
      inputVariableIds: [inputVariable.id],
      outputVariableIds: [outputVariable.id],
    });

    nodeConfig.fields.inputs.configs[0].variableIds.push(inputVariable.id);

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
    const inputs = params.nodeParams.inputs;
    const expressionString = params.nodeParams.expressionString;

    /**
     * NOTE: If anything went wrong here, it throw as an fatal error caught
     * by the runFlow process
     */
    const expression = jsonata(expressionString);
    const result = await expression.evaluate(inputs);

    return { variableValues: [result] };
  },
};
