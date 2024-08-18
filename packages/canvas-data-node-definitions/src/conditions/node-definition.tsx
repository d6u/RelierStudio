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

export type ConditionsNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Condition;
  type: (typeof CONDITIONS_NODE_DEFINITION)['type'];
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

export type ConditionsNodeParams = {
  kind: typeof NodeKind.Condition;
  type: (typeof CONDITIONS_NODE_DEFINITION)['type'];
  nodeId: string;
  inputs: Record<string, unknown>;
  stopAtFirstMatch: boolean;
};

type FieldKey = keyof ConditionsNodeConfig['fields'];

type FieldValueTypes = [never, boolean, never];

export type ConditionsNodeDefinition = NodeDefinition<
  'Conditions',
  FieldKey,
  FieldValueTypes
>;

export type ConditionsNodeConfigField =
  ConditionsNodeConfig['fields'][FieldKey];

// !SECTION

export const CONDITIONS_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Condition,
  'Conditions',
  'Conditions',
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
) as ConditionsNodeDefinition;

export const createDefaultConditionsNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'Conditions',
    FieldKey,
    FieldValueTypes,
    ConditionsNodeConfig
  >(CONDITIONS_NODE_DEFINITION);
