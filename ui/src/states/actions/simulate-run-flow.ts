import deepmerge from 'deepmerge';
import { produce } from 'immer';
import { Subject, Subscription } from 'rxjs';
import invariant from 'tiny-invariant';

import type { CanvasConfigKey } from 'canvas-config-definitions';
import {
  NodeConfigFieldType,
  NodeDefinitionConfigSectionKind,
} from 'canvas-data-base';
import { type CanvasDataV1, NODE_DEFINITIONS } from 'canvas-data-unified';
import randomId from 'common-utils/randomId';
import {
  type RunNodeProgressEvent,
  RunNodeProgressEventType,
  type VariableResultRecords,
  runFlow,
} from 'run-flow';

import { canvasConfigsAtom } from '../atoms/canvas-config';
import { canvasDataAtom } from '../atoms/canvas-data';
import { canvasSimulatePanelSelectedStartNodeIdAtom } from '../atoms/canvas-left-side-panel';
import {
  canvasRunDataRecordsAtom,
  canvasRunFlowSubscriptionAtom,
  canvasSelectedRunDataIdAtom,
} from '../atoms/canvas-run-data';
import { canvasStore } from '../store';

type SimulateRunFlowParams = {
  inputVariableResults: VariableResultRecords;
};

export async function simulateRunFlow(
  params: SimulateRunFlowParams,
): Promise<void> {
  /**
   * NOTE: Step 0 - stop previous run if any
   */

  const prevSubscription = canvasStore.get(canvasRunFlowSubscriptionAtom);
  if (prevSubscription != null) {
    prevSubscription.unsubscribe();
    canvasStore.set(canvasRunFlowSubscriptionAtom, null);
  }

  // NOTE: Validate Canvas Configs

  const canvasData = canvasStore.get(canvasDataAtom);
  const simulateSelectedNodeId = canvasStore.get(
    canvasSimulatePanelSelectedStartNodeIdAtom,
  );

  invariant(
    simulateSelectedNodeId != null,
    'Simulate selected nodeId should not be null',
  );

  const canvasConfigs = await selectCanvasConfigs(canvasData.nodeConfigs);

  // NOTE: Step 1 - compile graphs

  // const { errors } = computeGraphs({
  //   edges: canvasData.edges,
  //   nodeConfigs: canvasData.nodeConfigs,
  //   startNodeIds: [simulateSelectedNodeId],
  // });

  // NOTE: Step 2 - validate graphs

  // if (!R.isEmpty(errors)) {
  //   // TODO: Apply errors to specific nodes
  //   return of({
  //     errors: pipe(
  //       errors,
  //       R.collect(S.Ord)((_, list) => list),
  //       A.flatten,
  //       A.uniq(S.Eq),
  //     ),
  //     variableValues: {},
  //   });
  // }

  // const result = getNodeAllLevelConfigOrValidationErrors(
  //   canvasData.nodeConfigs,
  //   (fieldKey: string): string | null => {},
  // );

  // const validationErrors: ValidationError[] = [];

  // if (result.errors) {
  //   validationErrors.push(...result.errors);
  // }

  // if (validationErrors.length) {
  //   params.progressObserver.next({
  //     type: FlowRunEventType.ValidationErrors,
  //     errors: validationErrors,
  //   });

  //   return of({
  //     errors: validationErrors.map((error) => error.message),
  //     variableValues: {},
  //   });
  // }

  // invariant(
  //   result.nodeAllLevelConfigs != null,
  //   'nodeAllLevelConfigs is not null',
  // );

  // NOTE: Step 3 - prepare flow

  const selectedRunDataId = createNewRunData();

  // NOTE: Step 4 - run flow

  const subscriptionBag = new Subscription();

  const subject = new Subject<RunNodeProgressEvent>();

  const sub1 = subject.subscribe({
    next: (event) => {
      console.debug('progressObserver', event);

      canvasStore.set(canvasRunDataRecordsAtom, (prev) => {
        return produce(prev, (draft) => {
          const runData = draft[selectedRunDataId];

          switch (event.type) {
            case RunNodeProgressEventType.RunFlowInit:
              runData.runFlowStates = event.initialRunFlowStates;
              break;
            case RunNodeProgressEventType.Started:
              runData.nodeParams[event.nodeId] = event.nodeParams;

              // TODO: Change to deep assign
              runData.runFlowStates = deepmerge(
                runData.runFlowStates!,
                event.runFlowStates,
              );
              break;
            case RunNodeProgressEventType.Updated:
              Object.assign(
                runData.variableResults,
                event.result.variableValues,
              );

              Object.assign(
                runData.conditionResults,
                event.result.conditionResults,
              );
              break;
            case RunNodeProgressEventType.Finished:
              // TODO: Change to deep assign
              runData.runFlowStates = deepmerge(
                runData.runFlowStates!,
                event.runFlowStates,
              );
              break;
          }

          runData.updatedAt = Date.now();
        });
      });
    },
    error: (err) => {
      console.error('progressObserver', err);
    },
    complete: () => {
      console.log('progressObserver complete');
    },
  });

  subscriptionBag.add(sub1);

  const sub2 = runFlow({
    edges: canvasData.edges,
    nodeConfigs: canvasData.nodeConfigs,
    connectors: canvasData.connectors,
    inputVariableResults: params.inputVariableResults,
    canvasConfigs: canvasConfigs,
    startNodeId: simulateSelectedNodeId,
    preferStreaming: true,
    progressObserver: subject,
  }).subscribe({
    next: (result) => {
      console.log('runFlow', result);
    },
    error: (err) => {
      console.error('runFlow', err);
    },
    complete: () => {
      console.log('runFlow complete');
      stopRunFlow();
    },
  });

  subscriptionBag.add(sub2);

  canvasStore.set(canvasRunFlowSubscriptionAtom, subscriptionBag);
}

export function stopRunFlow(): void {
  const subscription = canvasStore.get(canvasRunFlowSubscriptionAtom);
  if (subscription != null) {
    subscription.unsubscribe();
    canvasStore.set(canvasRunFlowSubscriptionAtom, null);
  }
}

// NOTE: Util functions

async function selectCanvasConfigs(
  nodeConfigs: CanvasDataV1['nodeConfigs'],
): Promise<Record<CanvasConfigKey, string | null>> {
  const canvasConfigs = canvasStore.get(canvasConfigsAtom);

  const selectedCanvasConfigs: Record<string, string | null> = {};

  Object.values(nodeConfigs).forEach((nodeConfig) => {
    const nodeDef = NODE_DEFINITIONS[nodeConfig.type];

    for (const section of nodeDef.sections) {
      if (section.kind === NodeDefinitionConfigSectionKind.UI) {
        continue;
      }

      const field = nodeConfig.fields[section.key];
      const fieldDef = section.options[field.index];

      if (fieldDef.type !== NodeConfigFieldType.CanvasConfig) {
        continue;
      }

      selectedCanvasConfigs[fieldDef.canvasConfigKey] =
        canvasConfigs.find((config) => config.key === fieldDef.canvasConfigKey)
          ?.value ?? null;
    }
  });

  return selectedCanvasConfigs;
}

function createNewRunData(): string {
  const selectedRunDataId = randomId();

  canvasStore.set(canvasRunDataRecordsAtom, (prev) => {
    return produce(prev, (draft) => {
      draft[selectedRunDataId] = {
        id: selectedRunDataId,
        name: `Run ${selectedRunDataId}`,
        updatedAt: Date.now(),
        nodeParams: {},
        runFlowStates: null,
        variableResults: {},
        conditionResults: {},
      };
    });
  });

  canvasStore.set(canvasSelectedRunDataIdAtom, selectedRunDataId);

  return selectedRunDataId;
}
