import { z } from 'zod';

import { type NodeConfigFieldType } from '../NodeConfigFieldType';

export type NodeConfigInputVariableListFieldDefinition<_T = never> = {
  type: NodeConfigFieldType.InputVariableList;
};

export const NodeConfigInputVariableListFieldConfigSchema = z.array(z.string());

export type NodeConfigInputVariableListFieldConfig = {
  variableIds: string[];
};
