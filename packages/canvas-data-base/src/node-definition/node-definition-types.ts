import type { z } from 'zod';

import type { NodeConfigFieldDefinition } from '../field-definition-types';
import type { NodeKindEnum } from './node-kind';

export enum NodeDefinitionConfigSectionKind {
  Field = 'Field',
  UI = 'UI',
}

// ANCHOR: UI Config Section

export enum NodeDefinitionConfigSectionUIType {
  StartNodeVariables = 'StartNodeVariables',
  FinishNodeVariables = 'FinishNodeVariables',
  InputVariables = 'InputVariables',
  OutputVariables = 'OutputVariables',
  OutputConditionList = 'OutputConditionList',
}

export type NodeDefinitionUIConfigSection<_T = never, _K = never> = {
  kind: NodeDefinitionConfigSectionKind.UI;
  type: NodeDefinitionConfigSectionUIType;
};

// ANCHOR: Field Config Section

export type NodeDefinitionFieldConfigSection<
  TValue = never,
  TKey extends string = string,
> = {
  kind: NodeDefinitionConfigSectionKind.Field;
  key: TKey;
  label: string;
  schema: z.ZodFirstPartySchemaTypes;
  options: NodeConfigFieldDefinition<TValue>[];
};

// ANCHOR: Node Definition

export type NodeDefinitionConfigSection<TValue, TKey extends string> =
  | NodeDefinitionUIConfigSection<TValue, TKey>
  | NodeDefinitionFieldConfigSection<TValue, TKey>;

export type NodeDefinition<
  TType extends string,
  TFieldKeys extends string,
  TValues extends unknown[],
> = {
  kind: NodeKindEnum;
  type: TType;
  label: string;
  sections: {
    [Key in keyof TValues]: NodeDefinitionConfigSection<
      TValues[Key],
      TFieldKeys
    >;
  };
};
