import { z } from 'zod';

import {
  type NodeConfigBase,
  NodeConfigFieldType,
  type NodeConfigSubroutineStartSelectFieldConfig,
  type NodeDefinition,
  NodeDefinitionConfigSectionKind,
  type NodeDefinitionFieldConfigSection,
  NodeKind,
  createNodeDefinition,
  generateCreateDefaultNodeConfigFunction,
} from 'canvas-data-base';

// SECTION: Codegen

export type BareboneLoopNodeConfig = NodeConfigBase & {
  kind: typeof NodeKind.Subroutine;
  type: (typeof BAREBONE_LOOP_NODE_DEFINITION)['type'];
  fields: {
    targetSubroutine: {
      index: number;
      configs: [NodeConfigSubroutineStartSelectFieldConfig];
    };
  };
};

export type BareboneLoopNodeParams = {
  kind: typeof NodeKind.Subroutine;
  type: (typeof BAREBONE_LOOP_NODE_DEFINITION)['type'];
  nodeId: string;
  targetSubroutine: string | null;
};

type FieldKey = keyof BareboneLoopNodeConfig['fields'];

type FieldValueTypes = [never];

export type BareboneLoopNodeDefinition = NodeDefinition<
  'BareboneLoop',
  FieldKey,
  FieldValueTypes
>;

export type BareboneLoopNodeConfigField =
  BareboneLoopNodeConfig['fields'][FieldKey];

// !SECTION

export const BAREBONE_LOOP_NODE_DEFINITION = createNodeDefinition(
  NodeKind.Subroutine,
  'BareboneLoop',
  'Barebone Loop',
  [
    {
      kind: NodeDefinitionConfigSectionKind.Field,
      // NOTE: Currently, this field must be named "targetSubroutine"
      key: 'targetSubroutine',
      label: 'Target Subroutine',
      schema: z.string().nullable(),
      options: [
        {
          type: NodeConfigFieldType.SubroutineStartSelect,
        },
      ],
    } as NodeDefinitionFieldConfigSection<never, FieldKey>,
  ],
) as BareboneLoopNodeDefinition;

export const createDefaultBareboneLoopNodeConfdig =
  generateCreateDefaultNodeConfigFunction<
    'BareboneLoop',
    FieldKey,
    FieldValueTypes,
    BareboneLoopNodeConfig
  >(BAREBONE_LOOP_NODE_DEFINITION);
