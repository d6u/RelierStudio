import {
  BREAK_CONDITION_KEY,
  CONTINUE_CONDITION_KEY,
  type CreateDefaultCanvasDataContext,
  NodeFunctions,
  createIncomingCondition,
} from 'canvas-data-base';

import {
  type LoopBreakOrContinueNodeConfig,
  type LoopBreakOrContinueNodeParams,
  createDefaultLoopBreakOrContinueNodeConfig,
} from './node-definition';

export const LOOP_BREAK_OR_CONTINUE_NODE_FUNCTIONS: NodeFunctions<
  LoopBreakOrContinueNodeConfig,
  LoopBreakOrContinueNodeParams
> = {
  createDefaultCanvasData(context: CreateDefaultCanvasDataContext) {
    const nodeId = context.generateNodeId();

    const incomingBreakCondition = createIncomingCondition({
      id: context.generateConnectorId(),
      nodeId: nodeId,
      key: BREAK_CONDITION_KEY,
    });

    const incomingContinueCondition = createIncomingCondition({
      id: context.generateConnectorId(),
      nodeId: nodeId,
      key: CONTINUE_CONDITION_KEY,
    });

    const nodeConfig = createDefaultLoopBreakOrContinueNodeConfig({
      nodeId: nodeId,
      name: context.getAvailableNodeName('Check Loop End'),
      incomingConditionIds: [
        incomingBreakCondition.id,
        incomingContinueCondition.id,
      ],
      outgoingConditionIds: [],
      inputVariableIds: [],
      outputVariableIds: [],
    });

    return {
      nodeConfigs: [nodeConfig],
      connectors: [incomingBreakCondition, incomingContinueCondition],
    };
  },

  async runNode(_params) {
    return {};
  },
};
