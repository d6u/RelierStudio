import {
  type NodeConfigBase,
  type NodeDefinition,
  NodeDefinitionConfigSectionKind,
  NodeDefinitionConfigSectionUIType,
  NodeKind,
  createNodeDefinition,
  generateCreateDefaultNodeConfigFunction,
} from 'canvas-data-base';

// SECTION: Codegen

export type InputNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Start;
  type: (typeof INPUT_NODE_DEFINITION)['type'];
  fields: {};
};

export type InputNodeParams = {
  kind: typeof NodeKind.Start;
  type: (typeof INPUT_NODE_DEFINITION)['type'];
  nodeId: string;
};

type FieldKey = keyof InputNodeConfig['fields'];

type FieldValueTypes = [never];

export type InputNodeDefinition = NodeDefinition<
  'Input',
  FieldKey,
  FieldValueTypes
>;

export type InputNodeConfigField = InputNodeConfig['fields'][FieldKey];

// !SECTION

export const INPUT_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Start,
  'Input',
  'Input',
  [
    {
      kind: NodeDefinitionConfigSectionKind.UI,
      type: NodeDefinitionConfigSectionUIType.StartNodeVariables,
    },
  ],
) as InputNodeDefinition;

export const createDefaultInputNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'Input',
    FieldKey,
    FieldValueTypes,
    InputNodeConfig
  >(INPUT_NODE_DEFINITION);
