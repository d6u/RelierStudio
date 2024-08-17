import { z } from 'zod';

import {
  type NodeConfigBase,
  NodeConfigFieldType,
  type NodeConfigInputVariableListFieldConfig,
  type NodeConfigTextareaFieldConfig,
  type NodeDefinition,
  NodeDefinitionConfigSectionKind,
  NodeDefinitionConfigSectionUIType,
  type NodeDefinitionFieldConfigSection,
  NodeKind,
  createNodeDefinition,
  generateCreateDefaultNodeConfigFunction,
} from 'canvas-data-base';

// SECTION: Codegen

export type JsonataTransformNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Process;
  type: (typeof JSONATA_TRANSFORM_NODE_DEFINITION)['type'];
  fields: {
    inputs: {
      index: number;
      configs: [NodeConfigInputVariableListFieldConfig];
    };
    expressionString: {
      index: number;
      configs: [NodeConfigTextareaFieldConfig<string>];
    };
  };
};

export type JsonataTransformNodeParams = {
  kind: typeof NodeKind.Process;
  type: (typeof JSONATA_TRANSFORM_NODE_DEFINITION)['type'];
  nodeId: string;
  inputs: Record<string, unknown>;
  expressionString: string;
};

type FieldKey = keyof JsonataTransformNodeConfig['fields'];

type FieldValueTypes = [never, string, never];

export type JsonataTransformNodeDefinition = NodeDefinition<
  'JSONataTransform',
  FieldKey,
  FieldValueTypes
>;

export type JsonataTransformNodeConfigField =
  JsonataTransformNodeConfig['fields'][FieldKey];

// !SECTION

export const JSONATA_TRANSFORM_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Process,
  'JSONataTransform',
  'JSONata Transform',
  [
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'inputs',
      label: 'Input variables',
      schema: z.array(z.unknown()),
      options: [
        {
          type: NodeConfigFieldType.InputVariableList,
        },
      ],
    } as NodeDefinitionFieldConfigSection<string, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'expressionString',
      label: 'JSONata Expression',
      schema: z.string(),
      options: [
        {
          type: NodeConfigFieldType.Textarea,
          defaultValue: '{"output": input1}',
        },
      ],
    } as NodeDefinitionFieldConfigSection<string, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.UI,
      type: NodeDefinitionConfigSectionUIType.OutputVariables,
    },
  ],
) as JsonataTransformNodeDefinition;

export const createDefaultJsonataTransformNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'JSONataTransform',
    FieldKey,
    FieldValueTypes,
    JsonataTransformNodeConfig
  >(JSONATA_TRANSFORM_NODE_DEFINITION);
