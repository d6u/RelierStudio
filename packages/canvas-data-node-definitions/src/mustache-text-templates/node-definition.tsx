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

export type MustacheTextTemplatesNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Process;
  type: (typeof MUSTACHE_TEXT_TEMPLATES_NODE_DEFINITION)['type'];
  fields: {
    inputs: {
      index: number;
      configs: [NodeConfigInputVariableListFieldConfig];
    };
    templates: {
      index: number;
      configs: [NodeConfigTextareasWithOutputVariablesFieldConfig];
    };
  };
};

export type MustacheTextTemplatesNodeParams = {
  kind: typeof NodeKind.Process;
  type: (typeof MUSTACHE_TEXT_TEMPLATES_NODE_DEFINITION)['type'];
  nodeId: string;
  inputs: Record<string, unknown>;
  templates: string[];
};

type FieldKey = keyof MustacheTextTemplatesNodeConfig['fields'];

type FieldValueTypes = [never, never, never];

export type MustacheTextTemplatesNodeDefinition = NodeDefinition<
  'MustacheTextTemplates',
  FieldKey,
  FieldValueTypes
>;

export type MustacheTextTemplatesNodeConfigField =
  MustacheTextTemplatesNodeConfig['fields'][FieldKey];

// !SECTION

export const MUSTACHE_TEXT_TEMPLATES_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Process,
  'MustacheTextTemplates',
  'Text Templates',
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
      key: 'templates',
      label: 'Mustache Templates',
      schema: NodeConfigTextareasWithOutputVariablesFieldConfigSchema,
      options: [
        {
          type: NodeConfigFieldType.TextareasWithOutputVariables,
          defaultTextareaValues: ['Hello, {{{name}}}!'],
          placeholder: 'Enter Mustache template',
          helperText: () => {
            return (
              <>
                <a
                  href="https://mustache.github.io/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Mustache template
                </a>{' '}
                is used here. Use triple{' '}
                <b>
                  <code>{'{}'}</code>
                </b>
                , e.g. <code>{'{{{variableName}}}'}</code>, to insert a
                variable.
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
) as MustacheTextTemplatesNodeDefinition;

export const createDefaultMustacheTextTemplatesNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'MustacheTextTemplates',
    FieldKey,
    FieldValueTypes,
    MustacheTextTemplatesNodeConfig
  >(MUSTACHE_TEXT_TEMPLATES_NODE_DEFINITION);
