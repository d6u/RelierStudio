export const OllamaChatCompletionFormat = {
  json: 'json',
} as const;

export type OllamaChatCompletionFormatEnum =
  (typeof OllamaChatCompletionFormat)[keyof typeof OllamaChatCompletionFormat];
