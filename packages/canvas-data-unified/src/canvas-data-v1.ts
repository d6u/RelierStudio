import type {
  Connector,
  EdgePersistPartial,
  GlobalVariable,
  NodeKindEnum,
  NodePersistPartial,
} from 'canvas-data-base';
import {
  type BareboneLoopNodeConfigField,
  type BareboneLoopNodeParams,
  type BingSearchApiNodeConfigField,
  type BingSearchApiNodeParams,
  type ChatGPTChatCompletionNodeConfigField,
  type ChatGPTChatCompletionNodeParams,
  type InputNodeConfigField,
  type InputNodeParams,
  type JsonParseNodeConfigField,
  type JsonParseNodeParams,
  type JsonToStringNodeConfigField,
  type JsonToStringNodeParams,
  type JsonataConditionsNodeConfigField,
  type JsonataConditionsNodeParams,
  type JsonataTransformNodeConfigField,
  type JsonataTransformNodeParams,
  type LoopBreakOrContinueNodeConfigField,
  type LoopBreakOrContinueNodeParams,
  type LoopStartNodeConfigField,
  type LoopStartNodeParams,
  type MustacheTextTemplateNodeConfigField,
  type MustacheTextTemplateNodeParams,
  type OllamaChatCompletionNodeConfigField,
  type OllamaChatCompletionNodeParams,
  type OutputNodeConfigField,
  type OutputNodeParams,
} from 'canvas-data-node-definitions';

import type { NodeType } from './all-node-definitions';

// Canvas Data

type NodeConfigField =
  | InputNodeConfigField
  | OutputNodeConfigField
  | ChatGPTChatCompletionNodeConfigField
  | OllamaChatCompletionNodeConfigField
  | BingSearchApiNodeConfigField
  | MustacheTextTemplateNodeConfigField
  | JsonParseNodeConfigField
  | JsonToStringNodeConfigField
  | JsonataTransformNodeConfigField
  | JsonataConditionsNodeConfigField
  | BareboneLoopNodeConfigField
  | LoopStartNodeConfigField
  | LoopBreakOrContinueNodeConfigField;

export type NodeConfig = {
  kind: NodeKindEnum;
  type: NodeType;
  nodeId: string;
  name: string;
  incomingConditionIds: string[];
  outgoingConditionIds: string[];
  inputVariableIds: string[];
  outputVariableIds: string[];
  fields: Record<string, NodeConfigField>;
};

export type CanvasDataV1 = {
  edges: EdgePersistPartial[];
  nodes: NodePersistPartial[];
  /**
   * We cannot use NodeConfigUnion here, because TypeScript will have trouble
   * figuring the types in the NodeFieldConfigSection components.
   */
  nodeConfigs: Record<string, NodeConfig>;
  connectors: Record<string, Connector>;
  globalVaribles: Record<string, GlobalVariable>;
};

// Derived Canvas Data

export type NodeParams =
  | InputNodeParams
  | OutputNodeParams
  | ChatGPTChatCompletionNodeParams
  | OllamaChatCompletionNodeParams
  | BingSearchApiNodeParams
  | MustacheTextTemplateNodeParams
  | JsonParseNodeParams
  | JsonToStringNodeParams
  | JsonataTransformNodeParams
  | JsonataConditionsNodeParams
  | BareboneLoopNodeParams
  | LoopStartNodeParams
  | LoopBreakOrContinueNodeParams;
