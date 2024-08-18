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
  type ConditionsNodeConfigField,
  type ConditionsNodeParams,
  type InputNodeConfigField,
  type InputNodeParams,
  type JSONataTransformsNodeConfigField,
  type JSONataTransformsNodeParams,
  type JsonParseNodeConfigField,
  type JsonParseNodeParams,
  type JsonToStringNodeConfigField,
  type JsonToStringNodeParams,
  type LoopBreakOrContinueNodeConfigField,
  type LoopBreakOrContinueNodeParams,
  type LoopStartNodeConfigField,
  type LoopStartNodeParams,
  type MustacheTextTemplatesNodeConfigField,
  type MustacheTextTemplatesNodeParams,
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
  | MustacheTextTemplatesNodeConfigField
  | JsonParseNodeConfigField
  | JsonToStringNodeConfigField
  | JSONataTransformsNodeConfigField
  | ConditionsNodeConfigField
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
  | MustacheTextTemplatesNodeParams
  | JsonParseNodeParams
  | JsonToStringNodeParams
  | JSONataTransformsNodeParams
  | ConditionsNodeParams
  | BareboneLoopNodeParams
  | LoopStartNodeParams
  | LoopBreakOrContinueNodeParams;
