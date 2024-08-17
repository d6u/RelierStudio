import type { ReactNode } from 'react';
import type Zod from 'zod';

export enum CanvasConfigFieldType {
  Secret = 'Secret',
}

export type CavnasConfigSecretFieldDefinition = {
  type: CanvasConfigFieldType.Secret;
  label: string;
  placeholder?: string;
  helperText?: ReactNode;
  schema?: Zod.Schema;
};

export type CanvasConfigFieldDefinition = CavnasConfigSecretFieldDefinition;
