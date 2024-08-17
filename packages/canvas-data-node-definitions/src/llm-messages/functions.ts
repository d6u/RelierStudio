import {
  type CreateDefaultCanvasDataContext,
  NodeFunctions,
  createIncomingCondition,
  createOutgoingCondition,
  createOutputVariable,
} from 'canvas-data-base';

import {
  type LlmMessagesNodeConfig,
  type LlmMessagesNodeParams,
  createDefaultLlmMessagesNodeConfig,
} from './node-definition';

export const LLM_MESSAGES_NODE_FUNCTIONS: NodeFunctions<
  LlmMessagesNodeConfig,
  LlmMessagesNodeParams
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

    const outputVariableMessages = createOutputVariable({
      id: context.generateConnectorId(),
      nodeId: nodeId,
      name: 'messages',
    });

    const nodeConfig = createDefaultLlmMessagesNodeConfig({
      nodeId: nodeId,
      name: context.getAvailableNodeName('Messages'),
      incomingConditionIds: [incomingCondition.id],
      outgoingConditionIds: [outgoingCondition.id],
      inputVariableIds: [],
      outputVariableIds: [outputVariableMessages.id],
    });

    return {
      nodeConfigs: [nodeConfig],
      connectors: [
        incomingCondition,
        outgoingCondition,
        outputVariableMessages,
      ],
    };
  },

  async runNode(params) {
    return { variableValues: [params.nodeParams.messages] };
  },
};
