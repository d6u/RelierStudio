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
  type MustacheTextTemplatesNodeConfig,
  type MustacheTextTemplatesNodeParams,
  createDefaultMustacheTextTemplatesNodeConfig,
} from './node-definition';

export const MUSTACHE_TEXT_TEMPLATES_NODE_FUNCTIONS: NodeFunctions<
  MustacheTextTemplatesNodeConfig,
  MustacheTextTemplatesNodeParams
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
      name: 'text 1',
    });

    const nodeConfig = createDefaultMustacheTextTemplatesNodeConfig({
      nodeId: nodeId,
      name: context.getAvailableNodeName('Texts'),
      incomingConditionIds: [incomingCondition.id],
      outgoingConditionIds: [outgoingCondition.id],
      inputVariableIds: [inputVariable.id],
      outputVariableIds: [outputVariable.id],
    });

    nodeConfig.fields.inputs.configs[0].variableIds.push(inputVariable.id);
    nodeConfig.fields.templates.configs[0].value[0].outputVariableId =
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
    const templates = params.nodeParams.templates;

    const outputs = templates.map((template) => {
      // TODO: Warn user when template is an empty string
      /**
       * NOTE: If anything went wrong here, it throw as an fatal error caught
       * by the runFlow process
       */
      // TODO: Report to telemetry to improve error message
      return mustache.render(template, inputs);
    });

    return { variableValues: outputs };
  },
};
