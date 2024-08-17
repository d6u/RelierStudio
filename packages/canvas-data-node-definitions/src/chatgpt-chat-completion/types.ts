export const OpenAIChatModel = {
  // GPT-4o
  GPT_4O: 'gpt-4o',
  GPT_4O_2024_05_13: 'gpt-4o-2024-05-13',
  // GPT-4o-mini
  GPT_4O_MINI: 'gpt-4o-mini',
  GPT_4O_MINI_2024_07_18: 'gpt-4o-mini-2024-07-18',
  // GPT-4
  GPT_4_TURBO: 'gpt-4-turbo',
  GPT_4_TURBO_2024_04_09: 'gpt-4-turbo-2024-04-09',
  GPT_4_TURBO_PREVIEW: 'gpt-4-turbo-preview',
  GPT_4_0125_PREVIEW: 'gpt-4-0125-preview',
  GPT_4_1106_PREVIEW: 'gpt-4-1106-preview',
  GPT_4: 'gpt-4',
  GPT_4_0613: 'gpt-4-0613',
  // GPT-3.5
  GPT_3_5_TURBO_0125: 'gpt-3.5-turbo-0125',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  GPT_3_5_TURBO_1106: 'gpt-3.5-turbo-1106',
  GPT_3_5_TURBO_INSTRUCT: 'gpt-3.5-turbo-instruct',
} as const;

export type OpenAIChatModelEnum =
  (typeof OpenAIChatModel)[keyof typeof OpenAIChatModel];

export const ChatGPTChatCompletionResponseFormatType = {
  JsonObject: 'json_object',
} as const;

export type ChatGPTChatCompletionResponseFormatTypeEnum =
  (typeof ChatGPTChatCompletionResponseFormatType)[keyof typeof ChatGPTChatCompletionResponseFormatType];
