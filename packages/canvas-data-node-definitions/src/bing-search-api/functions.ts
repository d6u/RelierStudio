import {
  type CreateDefaultCanvasDataContext,
  NodeFunctions,
  createIncomingCondition,
  createOutgoingCondition,
  createOutputVariable,
} from 'canvas-data-base';

import {
  type BingSearchApiNodeConfig,
  type BingSearchApiNodeParams,
  createDefaultBingSearchApiNodeConfig,
} from './node-definition';

export const BING_SEARCH_API_NODE_FUNCTIONS: NodeFunctions<
  BingSearchApiNodeConfig,
  BingSearchApiNodeParams
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

    const resultOutputVariable = createOutputVariable({
      id: context.generateConnectorId(),
      nodeId: nodeId,
      name: 'result',
    });

    const nodeConfig = createDefaultBingSearchApiNodeConfig({
      nodeId: nodeId,
      name: context.getAvailableNodeName('Bing Search'),
      incomingConditionIds: [incomingCondition.id],
      outgoingConditionIds: [outgoingCondition.id],
      inputVariableIds: [],
      outputVariableIds: [resultOutputVariable.id],
    });

    return {
      nodeConfigs: [nodeConfig],
      connectors: [incomingCondition, outgoingCondition, resultOutputVariable],
    };
  },

  async runNode(params) {
    const { nodeParams, inputVariableValues } = params;

    // NOTE: Main Logic

    const searchParams = new URLSearchParams([
      ['q', inputVariableValues[0] as string],
    ]);

    const response = await fetch(
      `https://api.bing.microsoft.com/v7.0/search?${searchParams.toString()}`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': nodeParams.apiKey,
        },
      },
    );

    const result = await response.json();

    return { variableValues: [result] };
  },
};
