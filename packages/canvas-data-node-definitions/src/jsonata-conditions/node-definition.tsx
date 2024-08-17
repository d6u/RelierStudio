import { z } from 'zod';

import {
  type NodeConfigBase,
  type NodeConfigCheckboxFieldConfig,
  NodeConfigFieldType,
  type NodeConfigInputVariableListFieldConfig,
  type NodeDefinition,
  NodeDefinitionConfigSectionKind,
  NodeDefinitionConfigSectionUIType,
  type NodeDefinitionFieldConfigSection,
  NodeKind,
  createNodeDefinition,
  generateCreateDefaultNodeConfigFunction,
} from 'canvas-data-base';

// SECTION: Codegen

export type JsonataConditionsNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Condition;
  type: (typeof JSONATA_CONDITIONS_NODE_DEFINITION)['type'];
  fields: {
    inputs: {
      index: number;
      configs: [NodeConfigInputVariableListFieldConfig];
    };
    stopAtFirstMatch: {
      index: number;
      configs: [NodeConfigCheckboxFieldConfig<boolean>];
    };
  };
};

export type JsonataConditionsNodeParams = {
  kind: typeof NodeKind.Condition;
  type: (typeof JSONATA_CONDITIONS_NODE_DEFINITION)['type'];
  nodeId: string;
  inputs: Record<string, unknown>;
  stopAtFirstMatch: boolean;
};

type FieldKey = keyof JsonataConditionsNodeConfig['fields'];

type FieldValueTypes = [never, boolean, never];

export type JsonataConditionsNodeDefinition = NodeDefinition<
  'JSONataConditions',
  FieldKey,
  FieldValueTypes
>;

export type JsonataConditionsNodeConfigField =
  JsonataConditionsNodeConfig['fields'][FieldKey];

// !SECTION

export const JSONATA_CONDITIONS_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Condition,
  'JSONataConditions',
  'JSONata Conditions',
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
    } as NodeDefinitionFieldConfigSection<never, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'stopAtFirstMatch',
      label: 'Stop at The First Match',
      schema: z.boolean(),
      options: [
        {
          type: NodeConfigFieldType.Checkbox,
          defaultValue: false,
        },
      ],
    } as NodeDefinitionFieldConfigSection<boolean, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.UI,
      type: NodeDefinitionConfigSectionUIType.OutputConditionList,
    },
  ],
) as JsonataConditionsNodeDefinition;

export const createDefaultJsonataConditionsNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'JSONataConditions',
    FieldKey,
    FieldValueTypes,
    JsonataConditionsNodeConfig
  >(JSONATA_CONDITIONS_NODE_DEFINITION);
