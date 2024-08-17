import { z } from 'zod';

import {
  type NodeConfigBase,
  NodeConfigFieldType,
  type NodeConfigInputVariableFieldConfig,
  type NodeDefinition,
  NodeDefinitionConfigSectionKind,
  NodeDefinitionConfigSectionUIType,
  type NodeDefinitionFieldConfigSection,
  NodeKind,
  createNodeDefinition,
  generateCreateDefaultNodeConfigFunction,
} from 'canvas-data-base';

// SECTION: Codegen

export type JsonToStringNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Process;
  type: (typeof JSON_TO_STRING_NODE_DEFINITION)['type'];
  fields: {
    input: {
      index: number;
      configs: [NodeConfigInputVariableFieldConfig];
    };
  };
};

export type JsonToStringNodeParams = {
  kind: typeof NodeKind.Process;
  type: (typeof JSON_TO_STRING_NODE_DEFINITION)['type'];
  nodeId: string;
  input: unknown;
};

type FieldKey = keyof JsonToStringNodeConfig['fields'];

type FieldValueTypes = [unknown, never];

export type JsonToStringNodeDefinition = NodeDefinition<
  'JsonToString',
  FieldKey,
  FieldValueTypes
>;

export type JsonToStringNodeConfigField =
  JsonToStringNodeConfig['fields'][FieldKey];

// !SECTION

export const JSON_TO_STRING_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Process,
  'JsonToString',
  'JSON to String',
  [
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'input',
      label: 'Input JSON',
      schema: z.unknown(),
      options: [
        {
          type: NodeConfigFieldType.InputVariable,
        },
      ],
    } as NodeDefinitionFieldConfigSection<unknown, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.UI,
      type: NodeDefinitionConfigSectionUIType.OutputVariables,
    },
  ],
) as JsonToStringNodeDefinition;

export const createDefaultJsonToStringNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'JsonToString',
    FieldKey,
    FieldValueTypes,
    JsonToStringNodeConfig
  >(JSON_TO_STRING_NODE_DEFINITION);
