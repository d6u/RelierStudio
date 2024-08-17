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
  NodeConfigCanvasConfigFieldConfig,
  NodeConfigCheckboxFieldConfig,
  NodeConfigInputVariableFieldConfig,
  NodeConfigLlmMessagesFieldConfig,
  NodeConfigNumberFieldConfig,
  NodeConfigSelectFieldConfig,
  NodeConfigStopSequenceFieldConfig,
  NodeDefinition,
  NodeDefinitionFieldConfigSection,
} from 'canvas-data-base';

import {
  ChatGPTChatCompletionResponseFormatType,
  type ChatGPTChatCompletionResponseFormatTypeEnum,
  OpenAIChatModel,
  type OpenAIChatModelEnum,
} from './types';

// SECTION: Codegen

export type ChatGPTChatCompletionNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Process;
  type: (typeof CHATGPT_CHAT_COMPLETION_NODE_DEFINITION)['type'];
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
      configs: [NodeConfigSelectFieldConfig<OpenAIChatModelEnum>];
    };
    temperature: {
      index: number;
      configs: [NodeConfigNumberFieldConfig<number>];
    };
    responseFormatType: {
      index: number;
      configs: [
        NodeConfigCheckboxFieldConfig<ChatGPTChatCompletionResponseFormatTypeEnum | null>,
      ];
    };
    stop: {
      index: number;
      configs: [NodeConfigStopSequenceFieldConfig];
    };
    seed: {
      index: number;
      configs: [
        NodeConfigNumberFieldConfig<number | null>,
        NodeConfigInputVariableFieldConfig,
      ];
    };
    apiKey: {
      index: number;
      configs: [NodeConfigCanvasConfigFieldConfig];
    };
  };
};

export type ChatGPTChatCompletionNodeParams = {
  kind: typeof NodeKind.Process;
  type: (typeof CHATGPT_CHAT_COMPLETION_NODE_DEFINITION)['type'];
  nodeId: string;
  messages: LlmMessage[];
  model: OpenAIChatModelEnum;
  temperature: number;
  responseFormatType: ChatGPTChatCompletionResponseFormatTypeEnum | null;
  stop: string[];
  seed: number | null;
  apiKey: string;
};

type FieldKey = keyof ChatGPTChatCompletionNodeConfig['fields'];

type FieldValueTypes = [
  never, // messages
  OpenAIChatModelEnum, // model
  number, // temperature
  ChatGPTChatCompletionResponseFormatTypeEnum | null, // responseFormatType
  never, // stop
  // stop
  number | null, // seed
  never, // apiKey
  never,
];

export type ChatgptChatCompletionNodeDefinition = NodeDefinition<
  'ChatGPTChatCompletion',
  FieldKey,
  FieldValueTypes
>;

export type ChatGPTChatCompletionNodeConfigField =
  ChatGPTChatCompletionNodeConfig['fields'][FieldKey];

// !SECTION

export const CHATGPT_CHAT_COMPLETION_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Process,
  'ChatGPTChatCompletion',
  'ChatGPT Chat Completion',
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
          type: NodeConfigFieldType.Select,
          defaultValue: OpenAIChatModel.GPT_3_5_TURBO,
          options: Object.values(OpenAIChatModel).map((value) => ({
            label: value,
            value,
          })),
        },
      ],
    } as NodeDefinitionFieldConfigSection<OpenAIChatModelEnum, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'temperature',
      label: 'Temperature',
      schema: z
        .number()
        .min(0, { message: 'Must be between 0 and 2' })
        .max(2, { message: 'Must be between 0 and 2' }),
      options: [
        {
          type: NodeConfigFieldType.Number,
          min: 0,
          max: 2,
          step: 0.1,
          defaultValue: 1,
        },
      ],
    } as NodeDefinitionFieldConfigSection<number, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'responseFormatType',
      label: 'JSON Response Format Type',
      schema: z
        .enum([ChatGPTChatCompletionResponseFormatType.JsonObject])
        .nullable(),
      options: [
        {
          type: NodeConfigFieldType.Checkbox,
          defaultValue: null,
          render: (value) => value != null,
          parse: (value) =>
            value ? ChatGPTChatCompletionResponseFormatType.JsonObject : null,
        },
      ],
    } as NodeDefinitionFieldConfigSection<
      ChatGPTChatCompletionResponseFormatTypeEnum | null,
      FieldKey
    >,
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'stop',
      label: 'Stop sequence',
      schema: z.array(z.string()),
      options: [
        {
          type: NodeConfigFieldType.StopSequence,
          defaultValue: [],
        },
      ],
    } as NodeDefinitionFieldConfigSection<never, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'seed',
      label: 'Seed (optional, beta)',
      schema: z.number().int({ message: 'Seed must be an integer' }).nullable(),
      options: [
        {
          type: NodeConfigFieldType.Number,
          step: 1,
          defaultValue: null,
          render: (value) => (value != null ? String(value) : ''),
          parse: (value) => (value !== '' ? Number(value) : null),
        },
        {
          type: NodeConfigFieldType.InputVariable,
        },
      ],
    } as NodeDefinitionFieldConfigSection<number | null, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      key: 'apiKey',
      label: 'OpenAI API Key',
      schema: z.string(),
      options: [
        {
          type: NodeConfigFieldType.CanvasConfig,
          canvasConfigKey: 'openAiApiKey',
        },
      ],
    },
    {
      kind: NodeDefinitionConfigSectionKind.UI,
      type: NodeDefinitionConfigSectionUIType.OutputVariables,
    },
  ],
) as ChatgptChatCompletionNodeDefinition;

export const createDefaultChatGPTChatCompletionNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'ChatGPTChatCompletion',
    FieldKey,
    FieldValueTypes,
    ChatGPTChatCompletionNodeConfig
  >(CHATGPT_CHAT_COMPLETION_NODE_DEFINITION);
