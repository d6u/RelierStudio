import { z } from 'zod';

export const NodeConfigBaseSchema = z.object({
  nodeId: z.string(),
  name: z.string(),
  incomingConditionIds: z.array(z.string()),
  outgoingConditionIds: z.array(z.string()),
  inputVariableIds: z.array(z.string()),
  outputVariableIds: z.array(z.string()),
});

export type NodeConfigBase = z.infer<typeof NodeConfigBaseSchema>;
