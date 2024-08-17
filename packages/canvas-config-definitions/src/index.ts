import {
  CanvasConfigFieldDefinition,
  CanvasConfigFieldType,
} from 'canvas-config-base';
import { z } from 'zod';

const OPEN_AI_API_KEY_DEFINITION: CanvasConfigFieldDefinition = {
  type: CanvasConfigFieldType.Secret,
  label: 'OpenAI API Key',
  placeholder: 'Enter API key here',
  helperText: "This is stored in your browser's local storage. Never uploaded.",
  schema: z.string().min(1, { message: 'OpenAI API Key is required' }),
};

const BING_SEARCH_API_KEY_DEFINITION: CanvasConfigFieldDefinition = {
  type: CanvasConfigFieldType.Secret,
  label: 'API key',
  placeholder: 'Enter API key here',
  helperText: "This is stored in your browser's local storage. Never uploaded.",
  schema: z.string().min(1, { message: 'Bing Search API key is required' }),
};

const ELEVEN_LABS_API_KEY_DEFINITION: CanvasConfigFieldDefinition = {
  type: CanvasConfigFieldType.Secret,
  label: 'API Key',
  placeholder: 'Enter API key here',
  helperText: "This is stored in your browser's local storage. Never uploaded.",
  schema: z.string().min(1, { message: 'ElevenLabs API Key is required' }),
};

const HUGGINGFACE_API_TOKEN_DEFINITION = {
  type: CanvasConfigFieldType.Secret,
  label: 'API Token',
  placeholder: 'Enter API key here',
  helperText: "This is stored in your browser's local storage. Never uploaded.",
  schema: z.string().min(1, { message: 'HuggingFace API Token is required' }),
};

export const CANVAS_CONFIG_DEFINITIONS = {
  openAiApiKey: OPEN_AI_API_KEY_DEFINITION,
  bingSearchApiKey: BING_SEARCH_API_KEY_DEFINITION,
  elevenLabsApiKey: ELEVEN_LABS_API_KEY_DEFINITION,
  huggingFaceApiToken: HUGGINGFACE_API_TOKEN_DEFINITION,
} as const;

export type CanvasConfigKey = keyof typeof CANVAS_CONFIG_DEFINITIONS;

export type CanvasConfigRecords = Record<CanvasConfigKey, string | null>;
