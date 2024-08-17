import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { Subscription } from 'rxjs';

import type { NodeParams } from 'canvas-data-unified';
import type {
  ConditionResultRecords,
  RunFlowStates,
  VariableResultRecords,
} from 'run-flow';

import { generateStorageKeyForCanvasRunData } from '../util/generate-storage-key';
import { currentWorkflowIdAtom } from './workflows';

type RunData = {
  id: string;
  name: string;
  updatedAt: number;
  nodeParams: Record<string, NodeParams>;
  runFlowStates: RunFlowStates | null;
  variableResults: VariableResultRecords;
  conditionResults: ConditionResultRecords;
};

export const canvasRunDataRecordsAtom = atom<Record<string, RunData>>({});

canvasRunDataRecordsAtom.debugLabel = 'Canvas Run Data Records Atom';

let prevWorkflowId: string | null = null;

export const canvasRunDataRecordsEffect = atomEffect((get, set) => {
  const workflowId = get(currentWorkflowIdAtom);

  if (workflowId == null) {
    prevWorkflowId = null;
    return;
  }

  const runDataRecordsKey = generateStorageKeyForCanvasRunData(workflowId);

  /**
   * NOTE: Must establish the dependency on the canvasDataAtom for both cases
   * below.
   */
  let runDataRecords = get(canvasRunDataRecordsAtom);

  if (prevWorkflowId === workflowId) {
    /**
     * NOTE: This is when canvasData change, we need to save it to localStorage.
     */

    localStorage.setItem(runDataRecordsKey, JSON.stringify(runDataRecords));
    return;
  }

  /**
   * NOTE: When the flow ID changes, we need to reload canvas data from
   * localStorage.
   */

  prevWorkflowId = workflowId;

  const runDataRecordsJsonString = localStorage.getItem(runDataRecordsKey);

  if (runDataRecordsJsonString == null || runDataRecordsJsonString === '') {
    runDataRecords = {};
    localStorage.setItem(runDataRecordsKey, JSON.stringify(runDataRecords));
  } else {
    runDataRecords = JSON.parse(runDataRecordsJsonString);
  }

  set(canvasRunDataRecordsAtom, runDataRecords);
});

export const canvasSelectedRunDataIdAtom = atom<string | null>(null);

export const canvasRunFlowSubscriptionAtom = atom<Subscription | null>(null);
