import { z } from 'zod';

export const EdgePersistPartialSchema = z.object({
  id: z.string(),
  source: z.string(),
  sourceHandle: z.string(),
  target: z.string(),
  targetHandle: z.string(),
});

export type EdgePersistPartial = z.infer<typeof EdgePersistPartialSchema>;
