import mustache from 'mustache';

import {
  type CreateDefaultCanvasDataContext,
  NodeFunctions,
  createIncomingCondition,
  createInputVariable,
  createOutgoingCondition,
  createOutputVariable,
} from 'canvas-data-base';

import {
  type MustacheTextTemplateNodeConfig,
  type MustacheTextTemplateNodeParams,
  createDefaultMustacheTextTemplateNodeConfig,
} from './node-definition';

export const MUSTACHE_TEXT_TEMPLATE_NODE_FUNCTIONS: NodeFunctions<
  MustacheTextTemplateNodeConfig,
  MustacheTextTemplateNodeParams
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
      name: 'name',
    });

    const outputVariable = createOutputVariable({
      id: context.generateConnectorId(),
      nodeId: nodeId,
      name: 'text',
    });

    const nodeConfig = createDefaultMustacheTextTemplateNodeConfig({
      nodeId: nodeId,
      name: context.getAvailableNodeName('Text'),
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
    const template = params.nodeParams.template;

    const nameToValue: Record<string, unknown> = {};

    for (const [i, variable] of params.inputVariables.entries()) {
      nameToValue[variable.name] = params.inputVariableValues[i];
    }

    try {
      const text = mustache.render(template, nameToValue);

      return { variableValues: [text] };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // TODO: Report to telemetry to improve error message
      return {
        errors: ['message' in err ? err.message : 'Unknown error'],
      };
    }
  },
};
