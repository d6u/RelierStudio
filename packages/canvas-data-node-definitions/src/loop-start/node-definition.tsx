import {
  type NodeConfigBase,
  type NodeDefinition,
  NodeKind,
  createNodeDefinition,
  generateCreateDefaultNodeConfigFunction,
} from 'canvas-data-base';

// SECTION: Codegen

export type LoopStartNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.SubroutineStart;
  type: (typeof LOOP_START_NODE_DEFINITION)['type'];
  fields: {};
};

export type LoopStartNodeParams = {
  kind: typeof NodeKind.SubroutineStart;
  type: (typeof LOOP_START_NODE_DEFINITION)['type'];
  nodeId: string;
};

type FieldKey = keyof LoopStartNodeConfig['fields'];

type FieldValueTypes = [];

export type LoopStartNodeDefinition = NodeDefinition<
  'LoopStart',
  FieldKey,
  FieldValueTypes
>;

export type LoopStartNodeConfigField = LoopStartNodeConfig['fields'][FieldKey];

// !SECTION

export const LOOP_START_NODE_DEFINITION = createNodeDefinition(
  NodeKind.SubroutineStart,
  'LoopStart',
  'Loop Start',
  [],
) as LoopStartNodeDefinition;

export const createDefaultLoopStartNodeConfig =
  generateCreateDefaultNodeConfigFunction<
    'LoopStart',
    FieldKey,
    FieldValueTypes,
    LoopStartNodeConfig
  >(LOOP_START_NODE_DEFINITION);
