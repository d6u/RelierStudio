import type { ReactNode } from 'react';

import { type NodeConfigFieldType } from './NodeConfigFieldType';

export type NodeConfigTextareaFieldDefinition<T> = {
  type: NodeConfigFieldType.Textarea;
  defaultValue: T;
  placeholder?: string;
  helperText?: () => ReactNode;
  render?: (value: T) => string;
  parse?: (value: string) => T;
};

export type NodeConfigTextareaFieldConfig<T> = {
  value: T;
};
