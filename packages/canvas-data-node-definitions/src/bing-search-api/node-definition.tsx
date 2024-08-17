import { z } from 'zod';

import {
  type NodeConfigBase,
  NodeConfigFieldType,
  NodeDefinitionConfigSectionKind,
  NodeDefinitionConfigSectionUIType,
  NodeKind,
  createNodeDefinition,
  generateCreateDefaultNodeConfigFunction,
} from 'canvas-data-base';
import type {
  NodeConfigCanvasConfigFieldConfig,
  NodeConfigInputVariableFieldConfig,
  NodeConfigTextFieldConfig,
  NodeDefinition,
  NodeDefinitionFieldConfigSection,
} from 'canvas-data-base';

// SECTION: Codegen

export type BingSearchApiNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Process;
  type: (typeof BING_SEARCH_API_NODE_DEFINITION)['type'];
  fields: {
    query: {
      index: number;
      configs: [
        NodeConfigInputVariableFieldConfig,
        NodeConfigTextFieldConfig<string>,
      ];
    };
    apiKey: {
      index: number;
      configs: [NodeConfigCanvasConfigFieldConfig];
    };
  };
};

export type BingSearchApiNodeParams = {
  kind: typeof NodeKind.Process;
  type: (typeof BING_SEARCH_API_NODE_DEFINITION)['type'];
  nodeId: string;
  query: string;
  apiKey: string;
};

type FieldKey = keyof BingSearchApiNodeConfig['fields'];

type FieldValueTypes = [
  string, // query
  string, // apiKey
  never,
];

export type BingSearchApiNodeDefinition = NodeDefinition<
  'BingSearchApi',
  FieldKey,
  FieldValueTypes
>;

export type BingSearchApiNodeConfigField =
  BingSearchApiNodeConfig['fields'][FieldKey];

// !SECTION

export const BING_SEARCH_API_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Process,
  'BingSearchApi',
  'Bing Search',
  [
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'query',
      label: 'Search query',
      schema: z.string(),
      options: [
        {
          type: NodeConfigFieldType.InputVariable,
        },
        {
          type: NodeConfigFieldType.Text,
          defaultValue: '',
        },
      ],
    } as NodeDefinitionFieldConfigSection<string, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'apiKey',
      label: 'API key',
      schema: z.string(),
      options: [
        {
          type: NodeConfigFieldType.CanvasConfig,
          canvasConfigKey: 'bingSearchApiKey',
        },
      ],
    } as NodeDefinitionFieldConfigSection<string, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.UI,
      type: NodeDefinitionConfigSectionUIType.OutputVariables,
    },
  ],
) as BingSearchApiNodeDefinition;

export const createDefaultBingSearchApiNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'BingSearchApi',
    FieldKey,
    FieldValueTypes,
    BingSearchApiNodeConfig
  >(BING_SEARCH_API_NODE_DEFINITION);
