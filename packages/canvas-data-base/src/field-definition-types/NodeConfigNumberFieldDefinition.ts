import type { ReactNode } from 'react';

import { type NodeConfigFieldType } from './NodeConfigFieldType';

export type NodeConfigNumberFieldDefinition<T> = {
  type: NodeConfigFieldType.Number;
  defaultValue: T;
  min?: number;
  max?: number;
  step?: number;
  helperText?: () => ReactNode;
  render?: (value: T) => string;
  parse?: (value: string) => T;
};

export type NodeConfigNumberFieldConfig<T> = {
  value: T;
};
