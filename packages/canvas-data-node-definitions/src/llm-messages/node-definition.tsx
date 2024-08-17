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
  NodeConfigLlmMessagesFieldConfig,
  NodeDefinition,
  NodeDefinitionFieldConfigSection,
} from 'canvas-data-base';

// SECTION: Codegen

export type LlmMessagesNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Process;
  type: (typeof LLM_MESSAGES_NODE_DEFINITION)['type'];
  fields: {
    messages: {
      index: number;
      configs: [NodeConfigLlmMessagesFieldConfig];
    };
  };
};

export type LlmMessagesNodeParams = {
  kind: typeof NodeKind.Process;
  type: (typeof LLM_MESSAGES_NODE_DEFINITION)['type'];
  nodeId: string;
  messages: LlmMessage[];
};

type FieldKey = keyof LlmMessagesNodeConfig['fields'];

type FieldValueTypes = [
  never, // messages
  never,
];

export type LlmMessagesNodeDefinition = NodeDefinition<
  'LlmMessages',
  FieldKey,
  FieldValueTypes
>;

export type LlmMessagesNodeConfigField =
  LlmMessagesNodeConfig['fields'][FieldKey];

// !SECTION

export const LLM_MESSAGES_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Process,
  'LlmMessages',
  'LLM Messages',
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
      ],
    } as NodeDefinitionFieldConfigSection<never, FieldKey>,
    {
      kind: NodeDefinitionConfigSectionKind.UI,
      type: NodeDefinitionConfigSectionUIType.OutputVariables,
    },
  ],
) as LlmMessagesNodeDefinition;

export const createDefaultLlmMessagesNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'LlmMessages',
    FieldKey,
    FieldValueTypes,
    LlmMessagesNodeConfig
  >(LLM_MESSAGES_NODE_DEFINITION);
