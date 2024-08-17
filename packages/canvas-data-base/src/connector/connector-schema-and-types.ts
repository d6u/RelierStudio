import { z } from 'zod';

import { ConnectorType } from './ConnectorType';
import { OutgoingConditionSchema } from './outgoing-condition-schema';

export const InputVariableSchema = z.object({
  type: z.literal(ConnectorType.InputVariable),
  id: z.string(),
  name: z.string(),
  nodeId: z.string(),
  isReference: z.boolean(),
  referencedVariableId: z.string().nullable(),
});

export const OutputVariableSchema = z.object({
  type: z.literal(ConnectorType.OutputVariable),
  id: z.string(),
  name: z.string(),
  nodeId: z.string(),
  isReference: z.boolean(),
  referencedVariableId: z.string().nullable(),
});

export const IncomingConditionSchema = z.object({
  type: z.literal(ConnectorType.IncomingCondition),
  id: z.string(),
  nodeId: z.string(),
  key: z.string().optional(),
});

export const ConnectorSchema = z.discriminatedUnion('type', [
  InputVariableSchema,
  OutputVariableSchema,
  OutgoingConditionSchema,
  IncomingConditionSchema,
]);

export type InputVariable = z.infer<typeof InputVariableSchema>;
export type OutputVariable = z.infer<typeof OutputVariableSchema>;
export type IncomingCondition = z.infer<typeof IncomingConditionSchema>;
export type OutgoingCondition = z.infer<typeof OutgoingConditionSchema>;
export type Connector = z.infer<typeof ConnectorSchema>;

export const GlobalVariableSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type GlobalVariable = z.infer<typeof GlobalVariableSchema>;
