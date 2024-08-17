import { z } from 'zod';

import {
  type NodeConfigBase,
  NodeConfigFieldType,
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

export type MustacheTextTemplateNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Process;
  type: (typeof MUSTACHE_TEXT_TEMPLATE_NODE_DEFINITION)['type'];
  fields: {
    template: {
      index: number;
      configs: [NodeConfigTextareaFieldConfig<string>];
    };
  };
};

export type MustacheTextTemplateNodeParams = {
  kind: typeof NodeKind.Process;
  type: (typeof MUSTACHE_TEXT_TEMPLATE_NODE_DEFINITION)['type'];
  nodeId: string;
  template: string;
};

type FieldKey = keyof MustacheTextTemplateNodeConfig['fields'];

type FieldValueTypes = [never, string, never];

export type MustacheTextTemplateNodeDefinition = NodeDefinition<
  'MustacheTextTemplate',
  FieldKey,
  FieldValueTypes
>;

export type MustacheTextTemplateNodeConfigField =
  MustacheTextTemplateNodeConfig['fields'][FieldKey];

// !SECTION

export const MUSTACHE_TEXT_TEMPLATE_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Process,
  'MustacheTextTemplate',
  'Mustache Text Template',
  [
    {
      kind: NodeDefinitionConfigSectionKind.UI,
      type: NodeDefinitionConfigSectionUIType.InputVariables,
    },
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'template',
      label: 'Mustache Template',
      schema: z.string(),
      options: [
        {
          type: NodeConfigFieldType.Textarea,
          defaultValue: 'Hello, {{{name}}}!',
        },
      ],
    } as NodeDefinitionFieldConfigSection<string, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.UI,
      type: NodeDefinitionConfigSectionUIType.OutputVariables,
    },
  ],
) as MustacheTextTemplateNodeDefinition;

export const createDefaultMustacheTextTemplateNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'MustacheTextTemplate',
    FieldKey,
    FieldValueTypes,
    MustacheTextTemplateNodeConfig
  >(MUSTACHE_TEXT_TEMPLATE_NODE_DEFINITION);
