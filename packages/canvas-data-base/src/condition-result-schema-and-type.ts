import { z } from 'zod';

export const ConditionResultSchema = z.object({
  matched: z.boolean(),
});

export type ConditionResult = z.infer<typeof ConditionResultSchema>;
