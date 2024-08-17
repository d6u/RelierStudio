import { z } from 'zod';

export const VariableResultSchema = z.object({
  value: z.unknown(),
});

export type VariableResult = z.infer<typeof VariableResultSchema>;
