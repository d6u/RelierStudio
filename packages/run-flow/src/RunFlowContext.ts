import * as A from 'fp-ts/Array';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import type { Edge } from 'reactflow';
import invariant from 'tiny-invariant';

import {
  ConnectorType,
  type OutgoingCondition,
  type VariableResult,
} from 'canvas-data-base';

import RunGraphContext from './RunGraphContext';
import type {
  ConditionResultRecords,
  ConnectorRecords,
  RunFlowParams,
  VariableResultRecords,
} from './run-flow-types';
import {
  ConnectorRunState,
  type ConnectorRunStateEnum,
  EdgeRunState,
  type EdgeRunStateEnum,
  NodeRunState,
  type NodeRunStateEnum,
  type RunFlowStates,
} from './run-state-types';

type IdToIdRecords = Record<string, string>;
type IdToIdsRecords = Record<string, string[]>;

class RunFlowContext {
  constructor(params: RunFlowParams) {
    const {
      sourceHandleToEdgeIds,
      edgeIdToTargetHandle,
      targetHandleToEdgeIds,
    } = createIdMaps(params);

    this.allVariableResults = { ...params.inputVariableResults };
    this.allConditionResults = {};

    this.edgeIdToTargetHandle = edgeIdToTargetHandle;
    this.sourceHandleToEdgeIds = sourceHandleToEdgeIds;
    this.targetHandleToEdgeIds = targetHandleToEdgeIds;

    this.params = params;
    this.targetVariableIdToSourceVariableId =
      createTargetVariableIdToSourceVariableIdMap({
        edges: params.edges,
        connectors: params.connectors,
      });
  }

  allVariableResults: VariableResultRecords;
  allConditionResults: ConditionResultRecords;

  readonly edgeIdToTargetHandle: IdToIdRecords;
  readonly sourceHandleToEdgeIds: IdToIdsRecords;
  readonly targetHandleToEdgeIds: IdToIdsRecords;

  private readonly params: RunFlowParams;
  private readonly targetVariableIdToSourceVariableId: IdToIdRecords;

  createRunGraphContext(startNodeId: string): RunGraphContext {
    return new RunGraphContext(
      this,
      this.params,
      createInitialRunStates(this.params),
      startNodeId,
    );
  }

  getSourceVariableIdFromTargetVariableId(connectorId: string): string {
    return this.targetVariableIdToSourceVariableId[connectorId];
  }

  getVariableResultForId(variableId: string): VariableResult {
    return this.allVariableResults[variableId];
  }

  updateConditionResults(
    conditions: OutgoingCondition[],
    results: ConditionResultRecords,
  ): void {
    for (const c of conditions) {
      this.allConditionResults[c.id] = results[c.id];
    }
  }
}

type CreateTargetVariableIdToSourceVariableIdMapParam = {
  edges: Edge[];
  connectors: ConnectorRecords;
};

function createTargetVariableIdToSourceVariableIdMap(
  params: CreateTargetVariableIdToSourceVariableIdMapParam,
): IdToIdRecords {
  const records: IdToIdRecords = {};

  for (const { targetHandle, sourceHandle } of params.edges) {
    invariant(targetHandle, 'targetHandle is required');
    invariant(sourceHandle, 'sourceHandle is required');

    if (params.connectors[targetHandle].type === ConnectorType.InputVariable) {
      records[targetHandle] = sourceHandle;
    }
  }

  return records;
}

function createIdMaps(params: RunFlowParams): {
  edgeIdToTargetHandle: IdToIdRecords;
  sourceHandleToEdgeIds: IdToIdsRecords;
  targetHandleToEdgeIds: IdToIdsRecords;
} {
  const edgeIdToTargetHandle: IdToIdRecords = {};
  const sourceHandleToEdgeIds: IdToIdsRecords = {};
  const targetHandleToEdgeIds: IdToIdsRecords = {};

  for (const { id, sourceHandle, targetHandle } of params.edges) {
    invariant(sourceHandle != null, 'sourceHandle is required');
    invariant(targetHandle != null, 'targetHandle is required');

    if (sourceHandleToEdgeIds[sourceHandle] == null) {
      sourceHandleToEdgeIds[sourceHandle] = [];
    }

    if (targetHandleToEdgeIds[targetHandle] == null) {
      targetHandleToEdgeIds[targetHandle] = [];
    }

    sourceHandleToEdgeIds[sourceHandle].push(id);
    targetHandleToEdgeIds[targetHandle].push(id);

    edgeIdToTargetHandle[id] = targetHandle;
  }

  return {
    edgeIdToTargetHandle,
    sourceHandleToEdgeIds,
    targetHandleToEdgeIds,
  };
}

function createInitialRunStates(params: RunFlowParams): RunFlowStates {
  const connectorStates = pipe(
    params.connectors,
    R.map((): ConnectorRunStateEnum => ConnectorRunState.UNCONNECTED),
  );

  for (const { sourceHandle, targetHandle } of params.edges) {
    invariant(sourceHandle != null, 'sourceHandle is required');
    invariant(targetHandle != null, 'targetHandle is required');

    connectorStates[sourceHandle] = ConnectorRunState.PENDING;
    connectorStates[targetHandle] = ConnectorRunState.PENDING;
  }

  return {
    nodeStates: R.map((_): NodeRunStateEnum => NodeRunState.PENDING)(
      params.nodeConfigs,
    ),
    connectorStates: connectorStates,
    edgeStates: pipe(
      params.edges,
      A.map((edge): [string, EdgeRunStateEnum] => [
        edge.id,
        EdgeRunState.PENDING,
      ]),
      R.fromEntries,
    ),
  };
}

export default RunFlowContext;
