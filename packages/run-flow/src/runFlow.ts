import copy from 'fast-copy';
import {
  EMPTY,
  Observable,
  catchError,
  concat,
  concatAll,
  defer,
  ignoreElements,
  mergeMap,
  of,
  tap,
} from 'rxjs';
import invariant from 'tiny-invariant';

import {
  BREAK_CONDITION_KEY,
  CONTINUE_CONDITION_KEY,
  NodeKind,
  type RunNodeResult,
} from 'canvas-data-base';

import RunFlowContext from './RunFlowContext';
import type RunGraphContext from './RunGraphContext';
import RunNodeContext from './RunNodeContext';
import { type RunFlowResult, RunNodeProgressEventType } from './event-types';
import { type RunFlowParams } from './run-flow-types';
import { ConnectorRunState, NodeRunState } from './run-state-types';
import { getIncomingConditionsForNode } from './util';

function runFlow(params: RunFlowParams): Observable<RunFlowResult> {
  const context = new RunFlowContext(params);
  const runGraphContext = context.createRunGraphContext(params.startNodeId);

  params.progressObserver?.next({
    type: RunNodeProgressEventType.RunFlowInit,
    initialRunFlowStates: copy(runGraphContext.runFlowStates),
  });

  return concat(
    runRoutine(runGraphContext),
    defer(() => {
      params.progressObserver?.complete();
      return of(runGraphContext.getResult());
    }),
  );
}

export function runRoutine(context: RunGraphContext): Observable<never> {
  const nodeIdListSubject = context.nodeIdListSubject;

  return nodeIdListSubject.pipe(
    /**
     * Element in ArrayLike object returned from `mergeMap` will be converted
     * to Observable with these elements.
     */
    mergeMap((nodeIds) => {
      return nodeIds.map((nodeId) => {
        const runNodeContext = context.createRunNodeContext(nodeId);
        return runNode(runNodeContext).pipe(
          tap({
            complete() {
              context.emitNextNodeIdsOrCompleteRunRoutine(
                runNodeContext.affectedNodeIds,
              );
            },
          }),
        );
      });
    }),
    /**
     * NOTE: Switch from concatAll() to mergeAll() to subscribe to each
     * observable at the same time to maximize the concurrency.
     */
    concatAll(),
  );
}

export function runNode(context: RunNodeContext): Observable<never> {
  context.beforeRunHook();

  if (context.nodeRunState === NodeRunState.SKIPPED) {
    context.afterRunHook();
    return EMPTY;
  }

  context.progressObserver?.next({
    type: RunNodeProgressEventType.Started,
    nodeId: context.nodeId,
    nodeParams: context.nodeParams,
    // NOTE: Must do copy because the object will be mutated
    runFlowStates: copy(context.localNodeRunState),
  });

  return defer(() => {
    if (context.nodeConfig.kind === NodeKind.Subroutine) {
      return runSubroutine(context);
    } else {
      return context.createRunNodeObservable();
    }
  }).pipe(
    tap({
      next(result) {
        context.onRunNodeEvent(result);

        context.progressObserver?.next({
          type: RunNodeProgressEventType.Updated,
          nodeId: context.nodeId,
          result: context.getProgressUpdateData(),
        });
      },
      error(err) {
        console.error('runNode RunNodeObservable:', err);

        context.onRunNodeError(err);

        context.progressObserver?.next({
          type: RunNodeProgressEventType.Updated,
          nodeId: context.nodeId,
          result: context.getProgressUpdateData(),
        });
      },
      complete() {
        context.onRunNodeComplete();
      },
    }),
    ignoreElements(),
    catchError((_err) => {
      // TODO: Report to telemetry
      // console.error(err);
      return EMPTY;
    }),
    tap({
      complete() {
        context.afterRunHook();

        context.params.progressObserver?.next({
          type: RunNodeProgressEventType.Finished,
          nodeId: context.nodeId,
          // NOTE: Must do copy because the object will be mutated
          runFlowStates: copy(context.localNodeRunState),
        });
      },
    }),
  );
}

function runSubroutine(context: RunNodeContext): Observable<RunNodeResult> {
  const nodeParams = context.nodeParams;

  invariant(
    'targetSubroutine' in nodeParams,
    'targetSubroutine is required in nodeParams',
  );

  const targetSubroutine = nodeParams.targetSubroutine;

  invariant(targetSubroutine != null, 'targetSubroutine should not be null');

  return runLoopSubroutine(context, targetSubroutine);
}

const LOOP_HARD_LIMIT = 10;

function runLoopSubroutine(
  context: RunNodeContext,
  startNodeId: string,
  loopContext: { count: number } = { count: 0 },
): Observable<never> {
  const runGraphContext = context.createRunGraphContext(startNodeId);

  return concat(
    runRoutine(runGraphContext),
    defer(() => {
      if (!runGraphContext.didAnyFinishNodeSucceeded()) {
        return EMPTY;
      }

      let isContinue = false;
      let isBreak = false;

      for (const nodeId of runGraphContext.succeededFinishNodeIds) {
        const incomingConditions = getIncomingConditionsForNode(
          context.params.connectors,
          context.params.nodeConfigs[nodeId],
        );

        for (const condition of incomingConditions) {
          if (condition.key === BREAK_CONDITION_KEY) {
            const breakConditionState =
              runGraphContext.runFlowStates.connectorStates[condition.id];

            if (breakConditionState === ConnectorRunState.MET) {
              isBreak = true;
            }
          }
          if (condition.key === CONTINUE_CONDITION_KEY) {
            const continueConditionState =
              runGraphContext.runFlowStates.connectorStates[condition.id];

            if (continueConditionState === ConnectorRunState.MET) {
              isContinue = true;
            }
          }
        }
      }

      loopContext.count += 1;

      if (loopContext.count >= LOOP_HARD_LIMIT) {
        console.warn(`Loop count exceeded ${LOOP_HARD_LIMIT}, force break`);
        return EMPTY;
      }

      if (isContinue && isBreak) {
        console.warn(
          'Both continue and break are met, break condition will take precedence',
        );
      }

      if (isBreak) {
        return EMPTY;
      } else if (isContinue) {
        return runLoopSubroutine(context, startNodeId, loopContext);
      } else {
        console.warn('Neither continue nor break is met, fallback to break');
        return EMPTY;
      }
    }),
  );
}

export default runFlow;
