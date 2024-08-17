import {
  type NodeConfigBase,
  type NodeDefinition,
  NodeKind,
  createNodeDefinition,
  generateCreateDefaultNodeConfigFunction,
} from 'canvas-data-base';

// SECTION: Codegen

export type LoopBreakOrContinueNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Finish;
  type: (typeof LOOP_BREAK_OR_CONTINUE_NODE_DEFINITION)['type'];
  fields: {};
};

export type LoopBreakOrContinueNodeParams = {
  kind: typeof NodeKind.Finish;
  type: (typeof LOOP_BREAK_OR_CONTINUE_NODE_DEFINITION)['type'];
  nodeId: string;
};

type FieldKey = keyof LoopBreakOrContinueNodeConfig['fields'];

type FieldValueTypes = [];

export type LoopBreakOrContinueNodeDefinition = NodeDefinition<
  'LoopBreakOrContinue',
  FieldKey,
  FieldValueTypes
>;

export type LoopBreakOrContinueNodeConfigField =
  LoopBreakOrContinueNodeConfig['fields'][FieldKey];

// !SECTION

export const LOOP_BREAK_OR_CONTINUE_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Finish,
  'LoopBreakOrContinue',
  'Loop Break Or Continue',
  [],
) as LoopBreakOrContinueNodeDefinition;

export const createDefaultLoopBreakOrContinueNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'LoopBreakOrContinue',
    FieldKey,
    FieldValueTypes,
    LoopBreakOrContinueNodeConfig
  >(LOOP_BREAK_OR_CONTINUE_NODE_DEFINITION);
