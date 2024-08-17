import { z } from 'zod';

export const NodePersistPartialSchema = z.object({
  id: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export type NodePersistPartial = z.infer<typeof NodePersistPartialSchema>;
