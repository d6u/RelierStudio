import { type NodeConfigFieldType } from '../NodeConfigFieldType';

export type NodeConfigInputVariableFieldDefinition<_T = never> = {
  type: NodeConfigFieldType.InputVariable;
  defaultVariableName?: string;
};

export type NodeConfigInputVariableFieldConfig = {
  variableId: string | null;
};
