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
  type JSONataTransformsNodeConfig,
  type JSONataTransformsNodeParams,
  createDefaultJSONataTransformsNodeConfig,
} from './node-definition';

export const JSONATA_TRANSFORMS_NODE_FUNCTIONS: NodeFunctions<
  JSONataTransformsNodeConfig,
  JSONataTransformsNodeParams
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
      name: 'output 1',
    });

    const nodeConfig = createDefaultJSONataTransformsNodeConfig({
      nodeId: nodeId,
      name: context.getAvailableNodeName('Transforms'),
      incomingConditionIds: [incomingCondition.id],
      outgoingConditionIds: [outgoingCondition.id],
      inputVariableIds: [inputVariable.id],
      outputVariableIds: [outputVariable.id],
    });

    nodeConfig.fields.inputs.configs[0].variableIds.push(inputVariable.id);
    nodeConfig.fields.transformations.configs[0].value[0].outputVariableId =
      outputVariable.id;

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
    const expressionStrings = params.nodeParams.transformations;

    const outputs: unknown[] = await Promise.all(
      expressionStrings.map(async (expressionString) => {
        // TODO: Warn user of empty expression
        if (expressionString === '') {
          return null;
        }

        /**
         * NOTE: If anything went wrong here, it throw as an fatal error caught
         * by the runFlow process
         */
        const expression = jsonata(expressionString);
        return await expression.evaluate(inputs);
      }),
    );

    return { variableValues: outputs };
  },
};
