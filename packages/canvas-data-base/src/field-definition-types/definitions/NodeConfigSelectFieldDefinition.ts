import type { ReactNode } from 'react';

import { type NodeConfigFieldType } from '../NodeConfigFieldType';

export type SelectFieldOption<T> = {
  label: string;
  value: T;
};

export type NodeConfigSelectFieldDefinition<T> = {
  type: NodeConfigFieldType.Select;
  defaultValue: T;
  options: SelectFieldOption<T>[];
  helperText?: () => ReactNode;
};

export type NodeConfigSelectFieldConfig<T> = {
  value: T;
};
