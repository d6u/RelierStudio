import copy from 'fast-copy';

import randomId from 'common-utils/randomId';

import {
  NodeConfigFieldType,
  type TextareasWithOutputVariablesConfigValue,
} from '../field-definition-types';
import { NodeConfigBase } from './node-config-base-schema-and-type';
import {
  type NodeDefinition,
  type NodeDefinitionConfigSection,
  NodeDefinitionConfigSectionKind,
} from './node-definition-types';
import type { NodeKindEnum } from './node-kind';

export function createNodeDefinition<
  TType extends string,
  TKey extends string,
  TValues extends unknown[],
>(
  kind: NodeKindEnum,
  type: TType,
  label: string,
  sections: {
    [Key in keyof TValues]: NodeDefinitionConfigSection<TValues[Key], TKey>;
  },
): NodeDefinition<TType, TKey, TValues> {
  return {
    kind,
    type,
    label,
    sections,
  };
}

export function generateCreateDefaultNodeConfigFunction<
  TType extends string,
  TKey extends string,
  TValues extends unknown[],
  TNodeConfig,
>(nodeDef: NodeDefinition<TType, TKey, TValues>) {
  const fields: Record<string, unknown> = {};
  let fieldsCount = 0;

  for (const section of nodeDef.sections) {
    if (section.kind === NodeDefinitionConfigSectionKind.UI) {
      continue;
    }

    const fieldConfigs: unknown[] = [];

    for (const option of section.options) {
      switch (option.type) {
        case NodeConfigFieldType.InputVariable:
          fieldConfigs.push({ variableId: null });
          break;
        case NodeConfigFieldType.InputVariableList:
          fieldConfigs.push({ variableIds: [] });
          break;
        case NodeConfigFieldType.LlmMessages: {
          const defaultValue = copy(option.defaultValue);
          defaultValue.messages.forEach((msg) => {
            msg.id = randomId();
          });
          fieldConfigs.push(defaultValue);
          break;
        }
        case NodeConfigFieldType.CanvasConfig:
          fieldConfigs.push({});
          break;
        case NodeConfigFieldType.SubroutineStartSelect:
          fieldConfigs.push({ nodeId: null });
          break;
        case NodeConfigFieldType.TextareasWithOutputVariables: {
          const value: TextareasWithOutputVariablesConfigValue[] =
            option.defaultTextareaValues.map((value) => ({
              string: value,
              // NOTE: A real outputVariableId must be assigned before
              // passing to other parts of the system.
              outputVariableId: '',
            }));
          fieldConfigs.push({ value });
          break;
        }
        case NodeConfigFieldType.Text:
        case NodeConfigFieldType.Textarea:
        case NodeConfigFieldType.Number:
        case NodeConfigFieldType.Radio:
        case NodeConfigFieldType.Select:
        case NodeConfigFieldType.Checkbox:
        case NodeConfigFieldType.StopSequence:
          fieldConfigs.push({ value: option.defaultValue });
          break;
      }
    }

    if (fieldConfigs.length !== 0) {
      fields[section.key as string] = {
        index: 0,
        configs: fieldConfigs,
      };

      fieldsCount += 1;
    }
  }

  return (params: NodeConfigBase): TNodeConfig => {
    return {
      kind: nodeDef.kind,
      type: nodeDef.type,
      ...params,
      fields,
    } as unknown as TNodeConfig;
  };
}
