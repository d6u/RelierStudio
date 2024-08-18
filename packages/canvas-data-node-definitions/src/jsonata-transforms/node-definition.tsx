import {
  type NodeConfigBase,
  NodeConfigFieldType,
  type NodeConfigInputVariableListFieldConfig,
  NodeConfigInputVariableListFieldConfigSchema,
  type NodeConfigTextareasWithOutputVariablesFieldConfig,
  NodeConfigTextareasWithOutputVariablesFieldConfigSchema,
  type NodeDefinition,
  NodeDefinitionConfigSectionKind,
  NodeDefinitionConfigSectionUIType,
  type NodeDefinitionFieldConfigSection,
  NodeKind,
  createNodeDefinition,
  generateCreateDefaultNodeConfigFunction,
} from 'canvas-data-base';

// SECTION: Codegen

export type JSONataTransformsNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Process;
  type: (typeof JSONATA_TRANSFORMS_NODE_DEFINITION)['type'];
  fields: {
    inputs: {
      index: number;
      configs: [NodeConfigInputVariableListFieldConfig];
    };
    transformations: {
      index: number;
      configs: [NodeConfigTextareasWithOutputVariablesFieldConfig];
    };
  };
};

export type JSONataTransformsNodeParams = {
  kind: typeof NodeKind.Process;
  type: (typeof JSONATA_TRANSFORMS_NODE_DEFINITION)['type'];
  nodeId: string;
  inputs: Record<string, unknown>;
  transformations: string[];
};

type FieldKey = keyof JSONataTransformsNodeConfig['fields'];

type FieldValueTypes = [never, never, never];

export type JSONataTransformsNodeDefinition = NodeDefinition<
  'JSONataTransforms',
  FieldKey,
  FieldValueTypes
>;

export type JSONataTransformsNodeConfigField =
  JSONataTransformsNodeConfig['fields'][FieldKey];

// !SECTION

export const JSONATA_TRANSFORMS_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Process,
  'JSONataTransforms',
  'JSON Transforms',
  [
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'inputs',
      label: 'Input variables',
      schema: NodeConfigInputVariableListFieldConfigSchema,
      options: [
        {
          type: NodeConfigFieldType.InputVariableList,
        },
      ],
    } as NodeDefinitionFieldConfigSection<never, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'transformations',
      label: 'Transformations',
      schema: NodeConfigTextareasWithOutputVariablesFieldConfigSchema,
      options: [
        {
          type: NodeConfigFieldType.TextareasWithOutputVariables,
          defaultTextareaValues: ['{"output": input1}'],
          placeholder: 'Enter transform expression',
          helperText: () => {
            return (
              <>
                JSONata expression is used here, refer to{' '}
                <a
                  href="https://docs.jsonata.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  its document
                </a>{' '}
                to look up syntax for JSON data manipulation.
              </>
            );
          },
        },
      ],
    } as NodeDefinitionFieldConfigSection<never, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.UI,
      type: NodeDefinitionConfigSectionUIType.OutputVariables,
    },
  ],
) as JSONataTransformsNodeDefinition;

export const createDefaultJSONataTransformsNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'JSONataTransforms',
    FieldKey,
    FieldValueTypes,
    JSONataTransformsNodeConfig
  >(JSONATA_TRANSFORMS_NODE_DEFINITION);
