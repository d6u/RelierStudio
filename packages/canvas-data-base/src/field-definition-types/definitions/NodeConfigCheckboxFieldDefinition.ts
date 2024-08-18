import type { ReactNode } from 'react';

import { type NodeConfigFieldType } from '../NodeConfigFieldType';

export type NodeConfigCheckboxFieldDefinition<T> = {
  type: NodeConfigFieldType.Checkbox;
  defaultValue: T;
  render?: (value: T) => boolean;
  parse?: (value: boolean) => T;
  helperText?: () => ReactNode;
};

export type NodeConfigCheckboxFieldConfig<T> = {
  value: T;
};
