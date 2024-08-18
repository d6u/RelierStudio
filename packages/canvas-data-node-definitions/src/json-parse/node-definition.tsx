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

export type JsonParseNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Process;
  type: (typeof JSON_PARSE_NODE_DEFINITION)['type'];
  fields: {
    input: {
      index: number;
      configs: [NodeConfigInputVariableFieldConfig];
    };
  };
};

export type JsonParseNodeParams = {
  kind: typeof NodeKind.Process;
  type: (typeof JSON_PARSE_NODE_DEFINITION)['type'];
  nodeId: string;
  input: string;
};

type FieldKey = keyof JsonParseNodeConfig['fields'];

type FieldValueTypes = [string, never];

export type JsonParseNodeDefinition = NodeDefinition<
  'JsonParse',
  FieldKey,
  FieldValueTypes
>;

export type JsonParseNodeConfigField = JsonParseNodeConfig['fields'][FieldKey];

// !SECTION

export const JSON_PARSE_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Process,
  'JsonParse',
  'String to JSON',
  [
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'input',
      label: 'Input string',
      schema: z.string(),
      options: [
        {
          type: NodeConfigFieldType.InputVariable,
        },
      ],
    } as NodeDefinitionFieldConfigSection<string, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.UI,
      type: NodeDefinitionConfigSectionUIType.OutputVariables,
    },
  ],
) as JsonParseNodeDefinition;

export const createDefaultJsonParseNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'JsonParse',
    FieldKey,
    FieldValueTypes,
    JsonParseNodeConfig
  >(JSON_PARSE_NODE_DEFINITION);
