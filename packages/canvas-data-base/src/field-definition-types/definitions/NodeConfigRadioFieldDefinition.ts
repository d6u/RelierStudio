import type { ReactNode } from 'react';

import { type NodeConfigFieldType } from '../NodeConfigFieldType';

export type RadioFieldOption<T> = {
  label: string;
  value: T;
};

export type NodeConfigRadioFieldDefinition<T> = {
  type: NodeConfigFieldType.Radio;
  defaultValue: T;
  options: RadioFieldOption<T>[];
  helperText?: () => ReactNode;
};

export type NodeConfigRadioFieldConfig<T> = {
  value: T;
};
