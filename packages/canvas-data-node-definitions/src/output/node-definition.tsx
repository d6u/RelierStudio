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

export type OutputNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Finish;
  type: (typeof OUTPUT_NODE_DEFINITION)['type'];
  fields: {};
};

export type OutputNodeParams = {
  kind: typeof NodeKind.Finish;
  type: (typeof OUTPUT_NODE_DEFINITION)['type'];
  nodeId: string;
};

type FieldKey = keyof OutputNodeConfig['fields'];

type FieldValueTypes = [never];

export type OutputNodeDefinition = NodeDefinition<
  'Output',
  FieldKey,
  FieldValueTypes
>;

export type OutputNodeConfigField = OutputNodeConfig['fields'][FieldKey];

// !SECTION

export const OUTPUT_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Finish,
  'Output',
  'Output',
  [
    {
      kind: NodeDefinitionConfigSectionKind.UI,
      type: NodeDefinitionConfigSectionUIType.FinishNodeVariables,
    },
  ],
) as OutputNodeDefinition;

export const createDefaultOutputNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'Output',
    FieldKey,
    FieldValueTypes,
    OutputNodeConfig
  >(OUTPUT_NODE_DEFINITION);
