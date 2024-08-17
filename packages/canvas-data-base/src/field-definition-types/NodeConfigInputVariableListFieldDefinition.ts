import { type NodeConfigFieldType } from './NodeConfigFieldType';

export type NodeConfigInputVariableListFieldDefinition<_T = never> = {
  type: NodeConfigFieldType.InputVariableList;
};

export type NodeConfigInputVariableListFieldConfig = {
  variableIds: string[];
};
