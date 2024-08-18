import mustache from 'mustache';
import invariant from 'tiny-invariant';

import type { CanvasConfigRecords } from 'canvas-config-definitions';
import {
  ConnectorType,
  LlmMessageContentSource,
  type NodeConfigCheckboxFieldConfig,
  NodeConfigFieldType,
  type NodeConfigInputVariableFieldConfig,
  type NodeConfigInputVariableListFieldConfig,
  type NodeConfigLlmMessagesFieldConfig,
  type NodeConfigNumberFieldConfig,
  type NodeConfigRadioFieldConfig,
  type NodeConfigSelectFieldConfig,
  type NodeConfigStopSequenceFieldConfig,
  type NodeConfigSubroutineStartSelectFieldConfig,
  type NodeConfigTextFieldConfig,
  type NodeConfigTextareaFieldConfig,
  type NodeConfigTextareasWithOutputVariablesFieldConfig,
  NodeDefinitionConfigSectionKind,
} from 'canvas-data-base';
import {
  NODE_DEFINITIONS,
  type NodeConfig,
  type NodeParams,
} from 'canvas-data-unified';

import type {
  ConnectorRecords,
  InputVariableValueFromGraphGetter,
} from './run-flow-types';

type NodeConfigToNodeParamParams = {
  canvasConfigs: CanvasConfigRecords;
  nodeConfig: NodeConfig;
  connectors: ConnectorRecords;
  inputVariableValueFromGraphGetter: InputVariableValueFromGraphGetter;
};

export function nodeConfigToNodeParam(
  params: NodeConfigToNodeParamParams,
): NodeParams {
  const {
    canvasConfigs,
    nodeConfig,
    connectors,
    inputVariableValueFromGraphGetter,
  } = params;

  const nodeDef = NODE_DEFINITIONS[nodeConfig.type];

  const nodeParams: Record<string, unknown> = {
    kind: nodeConfig.kind,
    type: nodeConfig.type,
    nodeId: nodeConfig.nodeId,
  };

  for (const section of nodeDef.sections) {
    if (section.kind === NodeDefinitionConfigSectionKind.UI) {
      continue;
    }

    const field = nodeConfig.fields[section.key];
    const fieldDef = section.options[field.index];
    const fieldConfig = field.configs[field.index];

    nodeParams[section.key] = (() => {
      switch (fieldDef.type) {
        case NodeConfigFieldType.Text:
          return (fieldConfig as NodeConfigTextFieldConfig<unknown>).value;
        case NodeConfigFieldType.Textarea:
          return (fieldConfig as NodeConfigTextareaFieldConfig<unknown>).value;
        case NodeConfigFieldType.Number:
          return (fieldConfig as NodeConfigNumberFieldConfig<unknown>).value;
        case NodeConfigFieldType.Radio:
          return (fieldConfig as NodeConfigRadioFieldConfig<unknown>).value;
        case NodeConfigFieldType.Select:
          return (fieldConfig as NodeConfigSelectFieldConfig<unknown>).value;
        case NodeConfigFieldType.Checkbox:
          return (fieldConfig as NodeConfigCheckboxFieldConfig<unknown>).value;
        case NodeConfigFieldType.CanvasConfig:
          return canvasConfigs[fieldDef.canvasConfigKey];
        case NodeConfigFieldType.InputVariable: {
          const variableId = (fieldConfig as NodeConfigInputVariableFieldConfig)
            .variableId;
          if (variableId == null) {
            return null;
          }
          const connector = connectors[variableId];
          invariant(
            connector.type === ConnectorType.InputVariable,
            'Variable ID is not an Input Variable ID.',
          );
          return inputVariableValueFromGraphGetter(connector);
        }
        case NodeConfigFieldType.InputVariableList: {
          const variableIds = (
            fieldConfig as NodeConfigInputVariableListFieldConfig
          ).variableIds;

          const pairs = variableIds.map((variableId) => {
            const connector = connectors[variableId];
            invariant(
              connector.type === ConnectorType.InputVariable,
              'Variable ID is not an Input Variable ID.',
            );
            return [
              connector.name,
              inputVariableValueFromGraphGetter(connector),
            ];
          });

          return Object.fromEntries(pairs);
        }
        case NodeConfigFieldType.LlmMessages: {
          const fc = fieldConfig as NodeConfigLlmMessagesFieldConfig;
          const nameToValues: Record<string, unknown> = {};

          fc.variableIds.forEach((variableId) => {
            const connector = connectors[variableId];
            invariant(
              connector.type === ConnectorType.InputVariable,
              'Variable ID is not an Input Variable ID.',
            );
            nameToValues[connector.name] =
              inputVariableValueFromGraphGetter(connector);
          });

          return fc.messages.map((messageConfig) => {
            if (
              messageConfig.contentSourceType === LlmMessageContentSource.Inline
            ) {
              return {
                role: messageConfig.role,
                content: mustache.render(
                  messageConfig.contentInline,
                  nameToValues,
                ),
              };
            } else {
              invariant(
                messageConfig.contentVariableId != null,
                'Variable ID cannot be null when source type is Variable.',
              );
              const connector = connectors[messageConfig.contentVariableId];
              invariant(
                connector.type === ConnectorType.InputVariable,
                'Variable ID should be an input variable ID.',
              );
              return {
                role: messageConfig.role,
                content: inputVariableValueFromGraphGetter(connector),
              };
            }
          });
        }
        case NodeConfigFieldType.StopSequence:
          return (fieldConfig as NodeConfigStopSequenceFieldConfig).value;
        case NodeConfigFieldType.SubroutineStartSelect:
          return (fieldConfig as NodeConfigSubroutineStartSelectFieldConfig)
            .nodeId;
        case NodeConfigFieldType.TextareasWithOutputVariables: {
          const entries = (
            fieldConfig as NodeConfigTextareasWithOutputVariablesFieldConfig
          ).value;

          return entries.map((entry) => entry.string);
        }
      }
    })();
  }

  return nodeParams as NodeParams;
}
