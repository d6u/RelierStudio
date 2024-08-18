import { type Draft } from 'immer';
import invariant from 'tiny-invariant';

import {
  LlmMessageContentSource,
  NodeConfigFieldType,
  type NodeConfigInputVariableFieldConfig,
  type NodeConfigInputVariableListFieldConfig,
  type NodeConfigLlmMessagesFieldConfig,
  NodeDefinitionConfigSectionKind,
} from 'canvas-data-base';
import {
  type CanvasDataV1,
  NODE_DEFINITIONS,
  type NodeConfig,
} from 'canvas-data-unified';

export function updateNodeConfigInputVariableIds(
  canvasDataDraft: Draft<CanvasDataV1>,
  nodeId: string,
) {
  const nodeConfig = canvasDataDraft.nodeConfigs[nodeId];

  nodeConfig.inputVariableIds =
    collectAllInputVariableIdsFromActiveFieldConfigs(nodeConfig);
}

function collectAllInputVariableIdsFromActiveFieldConfigs(
  nodeConfig: NodeConfig,
): string[] {
  const nodeDef = NODE_DEFINITIONS[nodeConfig.type];

  const variableIds: string[] = [];

  for (const section of nodeDef.sections) {
    if (section.kind === NodeDefinitionConfigSectionKind.UI) {
      continue;
    }

    const field = nodeConfig.fields[section.key];
    const fieldDef = section.options[field.index];
    const fieldConfig = field.configs[field.index];

    switch (fieldDef.type) {
      case NodeConfigFieldType.InputVariable: {
        const config = fieldConfig as NodeConfigInputVariableFieldConfig;
        invariant(
          config.variableId != null,
          "variableId should not be null on an InputVariableFieldConfig when it's active",
        );
        variableIds.push(config.variableId);
        break;
      }
      case NodeConfigFieldType.InputVariableList: {
        const config = fieldConfig as NodeConfigInputVariableListFieldConfig;
        variableIds.push(...config.variableIds);
        break;
      }
      case NodeConfigFieldType.LlmMessages: {
        const config = fieldConfig as NodeConfigLlmMessagesFieldConfig;

        variableIds.push(...config.variableIds);

        for (const msgConfig of config.messages) {
          if (
            msgConfig.contentSourceType === LlmMessageContentSource.Variable
          ) {
            invariant(
              msgConfig.contentVariableId != null,
              'contentVariableId should not be null on a LLMMessageConfig when it has Variable contentSourceType',
            );
            variableIds.push(msgConfig.contentVariableId);
          }
        }
        break;
      }
      case NodeConfigFieldType.Text:
      case NodeConfigFieldType.Textarea:
      case NodeConfigFieldType.Number:
      case NodeConfigFieldType.Radio:
      case NodeConfigFieldType.Select:
      case NodeConfigFieldType.Checkbox:
      case NodeConfigFieldType.CanvasConfig:
      case NodeConfigFieldType.StopSequence:
      case NodeConfigFieldType.SubroutineStartSelect:
      case NodeConfigFieldType.TextareasWithOutputVariables:
        break;
    }
  }

  return variableIds;
}
