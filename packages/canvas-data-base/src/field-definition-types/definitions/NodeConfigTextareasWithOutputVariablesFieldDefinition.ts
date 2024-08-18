import type { ReactNode } from 'react';
import { z } from 'zod';

import { type NodeConfigFieldType } from '../NodeConfigFieldType';

// Field Definition

export type NodeConfigTextareasWithOutputVariablesFieldDefinition<_T = never> =
  {
    type: NodeConfigFieldType.TextareasWithOutputVariables;
    defaultTextareaValues: string[];
    placeholder?: string;
    helperText?: () => ReactNode;
  };

// Field Config

export type TextareasWithOutputVariablesConfigValue = {
  string: string;
  outputVariableId: string;
};

export const NodeConfigTextareasWithOutputVariablesFieldConfigSchema = z.object(
  {
    value: z.array(
      z.object({
        string: z.string(),
        outputVariableId: z.string(),
      }),
    ),
  },
);

export type NodeConfigTextareasWithOutputVariablesFieldConfig = {
  value: TextareasWithOutputVariablesConfigValue[];
};
