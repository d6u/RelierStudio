import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export type Workflow = {
  id: string;
  name: string;
  updatedAt: number;
  createdAt: number;
};

export const workflowsAtom = atomWithStorage<Workflow[]>(
  'workflows',
  [],
  createJSONStorage(() => localStorage),
  { getOnInit: true },
);

export const currentWorkflowIdAtom = atom<string | null>(null);
