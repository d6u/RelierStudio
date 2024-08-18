import { z } from 'zod';

import type { NodeConfigFieldType } from '../NodeConfigFieldType';

// Definition

export type NodeConfigLlmMessagesFieldDefinition<_T = never> = {
  type: NodeConfigFieldType.LlmMessages;
  defaultValue: NodeConfigLlmMessagesFieldConfig;
};

// Config

export const LlmMessageContentSource = {
  Inline: 'Inline',
  Variable: 'Variable',
} as const;

export type LlmMessageContentSourceEnum =
  (typeof LlmMessageContentSource)[keyof typeof LlmMessageContentSource];

export const LlmMessageRole = {
  system: 'system',
  user: 'user',
  assistant: 'assistant',
} as const;

export type LlmMessageRoleEnum =
  (typeof LlmMessageRole)[keyof typeof LlmMessageRole];

export type LlmMessageConfig = {
  id: string;
  role: LlmMessageRoleEnum;
  contentSourceType: LlmMessageContentSourceEnum;
  contentInline: string;
  contentVariableId: string | null;
};

export type NodeConfigLlmMessagesFieldConfig = {
  variableIds: string[];
  messages: LlmMessageConfig[];
};

// NodeParam

const LlmMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

export type LlmMessage = z.infer<typeof LlmMessageSchema>;

export const LlmMessagesSchema = z.array(LlmMessageSchema);
