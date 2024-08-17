import type { ReactNode } from 'react';

import { type NodeConfigFieldType } from './NodeConfigFieldType';

export type NodeConfigStopSequenceFieldDefinition<_T = never> = {
  type: NodeConfigFieldType.StopSequence;
  defaultValue: string[];
  placeholder?: string;
  helperText?: () => ReactNode;
};

export type NodeConfigStopSequenceFieldConfig = {
  value: string[];
};
