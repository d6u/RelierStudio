import { z } from 'zod';

import {
  LlmMessageContentSource,
  LlmMessageRole,
  LlmMessagesSchema,
  type NodeConfigBase,
  NodeConfigFieldType,
  NodeDefinitionConfigSectionKind,
  NodeDefinitionConfigSectionUIType,
  NodeKind,
  createNodeDefinition,
  generateCreateDefaultNodeConfigFunction,
} from 'canvas-data-base';
import type {
  LlmMessage,
  LlmMessageConfig,
  NodeConfigCheckboxFieldConfig,
  NodeConfigInputVariableFieldConfig,
  NodeConfigLlmMessagesFieldConfig,
  NodeConfigTextFieldConfig,
  NodeConfigTextareaFieldConfig,
  NodeDefinition,
  NodeDefinitionFieldConfigSection,
} from 'canvas-data-base';

import {
  OllamaChatCompletionFormat,
  type OllamaChatCompletionFormatEnum,
} from './types';

// SECTION: Codegen

export type OllamaChatCompletionNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Process;
  type: (typeof OLLAMA_CHAT_COMPLETION_NODE_DEFINITION)['type'];
  fields: {
    messages: {
      index: number;
      configs: [
        NodeConfigLlmMessagesFieldConfig,
        NodeConfigInputVariableFieldConfig,
      ];
    };
    model: {
      index: number;
      configs: [NodeConfigTextFieldConfig<string>];
    };
    format: {
      index: number;
      configs: [
        NodeConfigCheckboxFieldConfig<OllamaChatCompletionFormatEnum | null>,
      ];
    };
    options: {
      index: number;
      configs: [NodeConfigTextareaFieldConfig<string>];
    };
    endpoint: {
      index: number;
      configs: [NodeConfigTextFieldConfig<string>];
    };
  };
};

export type OllamaChatCompletionNodeParams = {
  kind: typeof NodeKind.Process;
  type: (typeof OLLAMA_CHAT_COMPLETION_NODE_DEFINITION)['type'];
  nodeId: string;
  messages: LlmMessage[];
  model: string;
  format: OllamaChatCompletionFormatEnum | null;
  options: string;
  endpoint: string;
};

type FieldKey = keyof OllamaChatCompletionNodeConfig['fields'];

type FieldValueTypes = [
  never, // messages
  string, // model
  OllamaChatCompletionFormatEnum | null, // format
  string, // options
  string, // endpoint
  never,
];

export type OllamaChatCompletionNodeDefinition = NodeDefinition<
  'OllamaChatCompletion',
  FieldKey,
  FieldValueTypes
>;

export type OllamaChatCompletionNodeConfigField =
  OllamaChatCompletionNodeConfig['fields'][FieldKey];

// !SECTION

export const OLLAMA_CHAT_COMPLETION_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Process,
  'OllamaChatCompletion',
  'Ollama Chat Completion',
  [
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'messages',
      label: 'Messages',
      schema: LlmMessagesSchema,
      options: [
        {
          type: NodeConfigFieldType.LlmMessages,
          defaultValue: {
            variableIds: [],
            messages: [
              {
                id: '',
                role: LlmMessageRole.user,
                contentSourceType: LlmMessageContentSource.Inline,
                contentInline: 'Hello!',
                contentVariableId: null,
              } as LlmMessageConfig,
            ],
          },
        },
        {
          type: NodeConfigFieldType.InputVariable,
        },
      ],
    } as NodeDefinitionFieldConfigSection<never, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'model',
      label: 'Model',
      schema: z.string(),
      options: [
        {
          type: NodeConfigFieldType.Text,
          defaultValue: 'llama3',
        },
      ],
    } as NodeDefinitionFieldConfigSection<string, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'format',
      label: 'Format',
      schema: z.enum([OllamaChatCompletionFormat.json]).nullable(),
      options: [
        {
          type: NodeConfigFieldType.Checkbox,
          defaultValue: null,
          helperText: () => {
            return 'Check this to pass "json" for "format" params to Ollama.';
          },
          render: (value) => value != null,
          parse: (value) => (value ? OllamaChatCompletionFormat.json : null),
        },
      ],
    } as NodeDefinitionFieldConfigSection<
      OllamaChatCompletionFormatEnum | null,
      FieldKey
    >,
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'options',
      label: 'Model Parameters',
      schema: z.string(),
      options: [
        {
          type: NodeConfigFieldType.Textarea,
          defaultValue: '{}',
          helperText: () => {
            return (
              <>
                Additional model parameters listed in the documentation for the{' '}
                <code>Modelfile</code> such as temperature. Must be a valid JSON
                string.
              </>
            );
          },
        },
      ],
    } as NodeDefinitionFieldConfigSection<string, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'endpoint',
      label: 'Ollama localhost URL',
      schema: z.string(),
      options: [
        {
          type: NodeConfigFieldType.Text,
          defaultValue: 'http://localhost:11434',
          helperText: () => {
            return (
              <>
                Enter the URL of the Ollama server without any path, e.g.{' '}
                <code>http://localhost:11434</code>
              </>
            );
          },
        },
      ],
    } as NodeDefinitionFieldConfigSection<string, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.UI,
      type: NodeDefinitionConfigSectionUIType.OutputVariables,
    },
  ],
) as OllamaChatCompletionNodeDefinition;

export const createDefaultOllamaChatCompletionNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'OllamaChatCompletion',
    FieldKey,
    FieldValueTypes,
    OllamaChatCompletionNodeConfig
  >(OLLAMA_CHAT_COMPLETION_NODE_DEFINITION);
