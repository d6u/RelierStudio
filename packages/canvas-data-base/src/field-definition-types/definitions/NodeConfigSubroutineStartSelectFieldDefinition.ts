import { type NodeConfigFieldType } from '../NodeConfigFieldType';

export type NodeConfigSubroutineStartSelectFieldDefinition<_T = never> = {
  type: NodeConfigFieldType.SubroutineStartSelect;
};

export type NodeConfigSubroutineStartSelectFieldConfig = {
  nodeId: string | null;
};
