import { produce } from 'immer';
import { type Observable, type Observer, from } from 'rxjs';

import {
  type ConditionResult,
  type IncomingCondition,
  type InputVariable,
  type NodeFunctionsDefault,
  NodeKind,
  type OutgoingCondition,
  type OutputVariable,
  type RunNodeFunction,
  type RunNodeObservableFunction,
  type RunNodeParams,
  type RunNodeResult,
} from 'canvas-data-base';
import {
  NODE_FUNCTIONS,
  type NodeConfig,
  type NodeParams,
} from 'canvas-data-unified';

import type RunGraphContext from './RunGraphContext';
import {
  type ProgressUpdateData,
  type RunNodeProgressEvent,
} from './event-types';
import { nodeConfigToNodeParam } from './node-config-to-node-param';
import {
  type ConditionResultRecords,
  RunFlowParams,
  type VariableResultRecords,
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
import {
  getIncomingConditionsForNode,
  getInputVariablesForNode,
  getOutgoingConditionsForNode,
  getOutputVariablesForNode,
} from './util';

class RunNodeContext {
  constructor(
    runGraphContext: RunGraphContext,
    params: RunFlowParams,
    nodeId: string,
  ) {
    const nodeConfig = params.nodeConfigs[nodeId];

    const incomingConditions = getIncomingConditionsForNode(
      params.connectors,
      nodeConfig,
    );
    const inputVariables = getInputVariablesForNode(
      params.connectors,
      nodeConfig,
    );
    const incomingConnectors = [...incomingConditions, ...inputVariables];
    const outputVariables = getOutputVariablesForNode(
      params.connectors,
      nodeConfig,
    );
    const outgoingConditions = getOutgoingConditionsForNode(
      params.connectors,
      nodeConfig,
    );
    const outgoingConnectors = [...outputVariables, ...outgoingConditions];

    this.runGraphContext = runGraphContext;
    this.params = params;
    this.nodeId = nodeId;
    this.nodeConfig = nodeConfig;
    this.incomingConnectors = incomingConnectors;
    this.outgoingConnectors = outgoingConnectors;
    this.inputVariables = inputVariables;
    this.outputVariables = outputVariables;
    this.outgoingConditions = outgoingConditions;
    this.runNodeFunc = getRunNodeFunction(nodeConfig);
  }

  readonly params: RunFlowParams;
  readonly nodeId: string;
  readonly nodeConfig: NodeConfig;
  readonly affectedNodeIds: Set<string> = new Set();

  private readonly inputVariables: InputVariable[];
  private readonly outputVariables: OutputVariable[];
  private readonly outgoingConditions: OutgoingCondition[];

  errors: string[] = [];
  runNodeFunc: RunNodeObservableFunction<NodeParams>;
  outputVariableValues: VariableResultRecords = {};
  outgoingConditionResults: ConditionResultRecords = {};

  /**
   * NOTE: Maintain a local nodeRunState so it's easier to emit changed states
   */
  localNodeRunState: RunFlowStates = {
    nodeStates: {},
    edgeStates: {},
    connectorStates: {},
  };

  get nodeParams(): NodeParams {
    // NOTE: We cannot call this in constructor because it depends on
    // an instance method.
    return nodeConfigToNodeParam({
      canvasConfigs: this.params.canvasConfigs,
      nodeConfig: this.nodeConfig,
      connectors: this.params.connectors,
      inputVariableValueFromGraphGetter: (variable: InputVariable): unknown =>
        this.getInputVariableValueFromGraph(variable),
    });
  }

  get progressObserver(): Observer<RunNodeProgressEvent> | null {
    return this.params.progressObserver ?? null;
  }

  get nodeRunState(): NodeRunStateEnum {
    return this.runFlowStates.nodeStates[this.nodeId];
  }

  private readonly runGraphContext: RunGraphContext;
  private readonly incomingConnectors: (InputVariable | IncomingCondition)[];
  private readonly outgoingConnectors: (OutputVariable | OutgoingCondition)[];

  private get sourceHandleToEdgeIds(): Record<string, string[]> {
    return this.runGraphContext.runFlowContext.sourceHandleToEdgeIds;
  }
  private get edgeIdToTargetHandle(): Record<string, string> {
    return this.runGraphContext.runFlowContext.edgeIdToTargetHandle;
  }
  private get targetHandleToEdgeIds(): Record<string, string[]> {
    return this.runGraphContext.runFlowContext.targetHandleToEdgeIds;
  }
  private get runFlowStates(): RunFlowStates {
    return this.runGraphContext.runFlowStates;
  }

  // SECTION: Called in runNode

  beforeRunHook(): void {
    this.updateNodeRunStateBaseOnIncomingConnectorStates();
  }

  createRunNodeObservable(): Observable<RunNodeResult> {
    return this.runNodeFunc(this.getParamsForRunNodeFunction());
  }

  onRunNodeEvent(event: RunNodeResult): void {
    if (event.errors != null) {
      this.errors = event.errors;
    }

    if (event.variableValues != null) {
      this.updateVariableValues(event.variableValues);
    }

    if (event.conditionResults != null) {
      this.updateConditionResults(event.conditionResults);
    }
  }

  onRunNodeError(err: any): void {
    this.errors = produce(this.errors, (draft) => {
      // Showing the fatal error message on top
      draft.unshift(
        typeof err === 'string' ? err : err.message ?? 'Unknown error',
      );
    });
    this.setNodeRunState(NodeRunState.FAILED);
  }

  onRunNodeComplete(): void {
    this.setNodeRunState(NodeRunState.SUCCEEDED);
    this.updateOutgoingConditionResultsIfNotConditionNode();
    this.propagateConnectorResults();
    this.handleFinishNode();
  }

  afterRunHook(): void {
    this.propagateRunState();
  }

  // !SECTION

  getProgressUpdateData(): ProgressUpdateData {
    return {
      errors: this.errors,
      variableValues: this.outputVariableValues,
      conditionResults: this.outgoingConditionResults,
    };
  }

  getParamsForRunNodeFunction(): RunNodeParams<NodeParams> {
    return {
      preferStreaming: this.params.preferStreaming,
      nodeParams: this.nodeParams,
      inputVariables: this.inputVariables,
      outputVariables: this.outputVariables,
      outgoingConditions: this.outgoingConditions,
      inputVariableValues: this.getInputVariableValues(),
    };
  }

  getInputVariableValues(): unknown[] {
    /**
     * NOTE: There are different cases base on node kind:
     *
     * 1. Getting variable value for Start node: Start node's output variable
     *    is provided by the user or the invoking routine (if this the Start
     *    node is part of a subroutine), thus the `isReference` property should
     *    be ignored when reading values.
     * 2. Getting variable value for non-Start node:
     *    a. If `isReference`, get value from `referencedVariableId` reference.
     *    b. If not `isReference`, get value from the source variable based on
     *       the connected edge.
     *
     * Always fallback to null if the value is not found.
     */

    if (
      this.nodeConfig.kind === NodeKind.Start ||
      this.nodeConfig.kind === NodeKind.SubroutineStart
    ) {
      // NOTE: The value might not be provided, always fallback to null.
      return this.outputVariables.map(
        (v) =>
          this.runGraphContext.runFlowContext.allVariableResults[v.id]?.value ??
          null,
      );
    }

    return this.inputVariables.map((v) =>
      this.getInputVariableValueFromGraph(v),
    );
  }

  getInputVariableValueFromGraph(variable: InputVariable): unknown {
    if (variable.isReference) {
      if (variable.referencedVariableId == null) {
        return null;
      }

      // NOTE: The value might not be provided, always fallback to null.
      return (
        this.runGraphContext.runFlowContext.allVariableResults[
          variable.referencedVariableId
        ]?.value ?? null
      );
    }

    const sourceVariableId =
      this.runGraphContext.runFlowContext.getSourceVariableIdFromTargetVariableId(
        variable.id,
      );

    // NOTE: The value might not be provided, always fallback to null.
    return (
      this.runGraphContext.runFlowContext.allVariableResults[sourceVariableId]
        ?.value ?? null
    );
  }

  updateNodeRunStateBaseOnIncomingConnectorStates(): void {
    if (this.nodeConfig.kind === NodeKind.Finish) {
      let anyIncomingConditionMet = false;

      for (const { id } of this.incomingConnectors) {
        const state = this.runFlowStates.connectorStates[id];

        if (state === ConnectorRunState.MET) {
          anyIncomingConditionMet = true;
          break;
        }
      }

      if (anyIncomingConditionMet) {
        this.setNodeRunState(NodeRunState.RUNNING);
      } else {
        this.setNodeRunState(NodeRunState.SKIPPED);
      }
    } else {
      for (const { id } of this.incomingConnectors) {
        const state = this.runFlowStates.connectorStates[id];

        if (
          state === ConnectorRunState.SKIPPED ||
          state === ConnectorRunState.UNMET
        ) {
          this.setNodeRunState(NodeRunState.SKIPPED);
          return;
        }
      }

      this.setNodeRunState(NodeRunState.RUNNING);
    }
  }

  // NOTE: Called during runNode in progress
  updateVariableValues(variableValues: unknown[]): void {
    if (this.nodeConfig.kind === NodeKind.Finish) {
      for (const [i, v] of this.inputVariables.entries()) {
        this.outputVariableValues[v.id] = { value: variableValues[i] };
      }
      return;
    }

    for (const [i, v] of this.outputVariables.entries()) {
      this.outputVariableValues[v.id] = { value: variableValues[i] };
    }
  }

  // NOTE: Called during runNode in progress
  updateConditionResults(conditionResults: ConditionResult[]): void {
    this.outgoingConditions.forEach((c, i) => {
      this.outgoingConditionResults[c.id] = conditionResults[i];
    });
  }

  createRunGraphContext(graphId: string): RunGraphContext {
    return this.runGraphContext.createRunGraphContext(graphId);
  }

  // NOTE: Run after runNode finished
  updateOutgoingConditionResultsIfNotConditionNode() {
    // NOTE: For none Condition node, we need to generate a condition result.
    if (this.nodeConfig.kind !== NodeKind.Condition) {
      for (const c of this.outgoingConditions) {
        this.outgoingConditionResults[c.id] = { matched: true };
      }
    }
  }

  // NOTE: Run after runNode finished
  propagateConnectorResults() {
    // NOTE: Variable values
    if (this.nodeConfig.kind === NodeKind.Finish) {
      this.inputVariables.forEach(({ id }) => {
        this.runGraphContext.runFlowContext.allVariableResults[id] =
          this.outputVariableValues[id];
      });
    } else {
      this.outputVariables.forEach((v) => {
        if (!v.isReference) {
          this.runGraphContext.runFlowContext.allVariableResults[v.id] =
            this.outputVariableValues[v.id] = this.outputVariableValues[v.id];
          return;
        }

        if (v.referencedVariableId != null) {
          this.runGraphContext.runFlowContext.allVariableResults[
            v.referencedVariableId
          ] = this.outputVariableValues[v.id];
        }
      });
    }

    // NOTE: Condition results
    this.runGraphContext.runFlowContext.updateConditionResults(
      this.outgoingConditions,
      this.outgoingConditionResults,
    );
  }

  // NOTE: Run after runNode finished
  propagateRunState() {
    // NOTE: Outgoing connector states
    const nodeState = this.runFlowStates.nodeStates[this.nodeId];
    const updatedConnectorIds: Set<string> = new Set();

    if (
      nodeState === NodeRunState.SKIPPED ||
      nodeState === NodeRunState.FAILED
    ) {
      // Output variable and condition states
      for (const { id } of this.outgoingConnectors) {
        this.setConnectorRunState(id, ConnectorRunState.SKIPPED);
        updatedConnectorIds.add(id);
      }
    } else {
      // Output variable states
      for (const { id } of this.outputVariables) {
        this.setConnectorRunState(id, ConnectorRunState.MET);
        updatedConnectorIds.add(id);
      }

      // Outgoing condition states
      for (const { id } of this.outgoingConditions) {
        // NOTE: We don't need to check if the condition is met or not,
        const isConditionMatched = this.outgoingConditionResults[id].matched;

        if (isConditionMatched) {
          this.setConnectorRunState(id, ConnectorRunState.MET);
        } else {
          this.setConnectorRunState(id, ConnectorRunState.UNMET);
        }

        updatedConnectorIds.add(id);
      }
    }

    // NOTE: Propagate edge states
    const updatedEdgeIds: string[] = [];

    for (const connectorId of updatedConnectorIds) {
      const edgeIds = this.sourceHandleToEdgeIds[connectorId];

      if (edgeIds == null) {
        continue;
      }

      const connectorState = this.runFlowStates.connectorStates[connectorId];

      if (connectorState === ConnectorRunState.SKIPPED) {
        edgeIds.forEach((edgeId) => {
          this.setEdgeRunState(edgeId, EdgeRunState.SKIPPED);
        });
      } else if (connectorState === ConnectorRunState.UNMET) {
        edgeIds.forEach((edgeId) => {
          this.setEdgeRunState(edgeId, EdgeRunState.UNMET);
        });
      } else if (connectorState === ConnectorRunState.MET) {
        edgeIds.forEach((edgeId) => {
          this.setEdgeRunState(edgeId, EdgeRunState.MET);
        });
      }

      updatedEdgeIds.push(...edgeIds);
    }

    // NOTE: Propagate incoming connector states of updated edges
    for (const updatedEdgeId of updatedEdgeIds) {
      const targetConnectorId = this.edgeIdToTargetHandle[updatedEdgeId];
      const edgeStates = this.targetHandleToEdgeIds[targetConnectorId].map(
        (edgeId) => this.runFlowStates.edgeStates[edgeId],
      );

      if (edgeStates.some((s) => s === EdgeRunState.PENDING)) {
        // We don't need to set the state because it starts with PENDING,
        // but do it anyway for clarity.
        this.setConnectorRunState(targetConnectorId, ConnectorRunState.PENDING);
        continue;
      } else if (edgeStates.some((s) => s === EdgeRunState.MET)) {
        this.setConnectorRunState(targetConnectorId, ConnectorRunState.MET);
      } else if (edgeStates.some((s) => s === EdgeRunState.UNMET)) {
        this.setConnectorRunState(targetConnectorId, ConnectorRunState.UNMET);
      } else {
        this.setConnectorRunState(targetConnectorId, ConnectorRunState.SKIPPED);
      }

      const connector = this.params.connectors[targetConnectorId];
      this.affectedNodeIds.add(connector.nodeId);
    }
  }

  handleFinishNode() {
    // NOTE: When current node is a Finish node and not a LoopFinish node,
    // record connector IDs
    if (this.nodeConfig.kind === NodeKind.Finish) {
      this.runGraphContext.succeededFinishNodeIds.push(this.nodeId);
      this.runGraphContext.finishNodesVariableIds.push(
        ...this.inputVariables.map((v) => v.id),
      );
    }
  }

  private setNodeRunState(nodeRunState: NodeRunStateEnum) {
    this.runFlowStates.nodeStates[this.nodeId] = nodeRunState;
    this.localNodeRunState.nodeStates[this.nodeId] = nodeRunState;
  }

  private setConnectorRunState(
    id: string,
    connectorRunState: ConnectorRunStateEnum,
  ) {
    this.runFlowStates.connectorStates[id] = connectorRunState;
    this.localNodeRunState.connectorStates[id] = connectorRunState;
  }

  private setEdgeRunState(id: string, edgeRunState: EdgeRunStateEnum) {
    this.runFlowStates.edgeStates[id] = edgeRunState;
    this.localNodeRunState.edgeStates[id] = edgeRunState;
  }
}

function getRunNodeFunction(
  nodeConfig: NodeConfig,
): RunNodeObservableFunction<NodeParams> {
  const nodeFuncs = NODE_FUNCTIONS[nodeConfig.type] as NodeFunctionsDefault<
    NodeConfig,
    NodeParams
  >;

  if (nodeFuncs.runNode == null && nodeFuncs.runNodeObservable == null) {
    throw new Error(
      'Node functions must have either runNode or createNodeExecutionObservable',
    );
  }

  if (nodeFuncs.runNodeObservable != null) {
    return nodeFuncs.runNodeObservable;
  } else {
    // No null check needed here, because we checked it above.
    const runNode = nodeFuncs.runNode as RunNodeFunction<NodeParams>;
    return (params) => from(runNode(params));
  }
}

export default RunNodeContext;
