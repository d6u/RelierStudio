import type { ReactNode } from 'react';

import { type NodeConfigFieldType } from '../NodeConfigFieldType';

export type NodeConfigTextFieldDefinition<T> = {
  type: NodeConfigFieldType.Text;
  defaultValue: T;
  placeholder?: string;
  helperText?: () => ReactNode;
  render?: (value: T) => string;
  parse?: (value: string) => T;
};

export type NodeConfigTextFieldConfig<T> = {
  value: T;
};
