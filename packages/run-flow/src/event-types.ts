import type { NodeParams, NodeType } from 'canvas-data-unified';

import type {
  ConditionResultRecords,
  VariableResultRecords,
} from './run-flow-types';
import type { RunFlowStates } from './run-state-types';

// ANCHOR: Event Types

export enum FlowRunEventType {
  ValidationErrors = 'ValidationErrors',
  NodeStart = 'NodeStart',
  NodeFinish = 'Finish',
  NodeErrors = 'Errors',
  VariableValues = 'VariableValues',
}

// ANCHOR: Validation Error

export enum ValidationErrorType {
  AccountLevel = 'AccountLevel',
  FlowLevel = 'FlowLevel',
  NodeLevel = 'NodeLevel',
}

export type AccountLevelValidationError = {
  type: ValidationErrorType.AccountLevel;
  nodeType: NodeType;
  fieldKey: string;
  message: string;
};

export type FlowLevelValidationError = {
  type: ValidationErrorType.FlowLevel;
  message: string;
};

export type NodeLevelValidationError = {
  type: ValidationErrorType.NodeLevel;
  nodeId: string;
  message: string;
};

export type ValidationError =
  | AccountLevelValidationError
  | FlowLevelValidationError
  | NodeLevelValidationError;

export type FlowRunValidationErrorsEvent = {
  type: FlowRunEventType.ValidationErrors;
  errors: ReadonlyArray<ValidationError>;
};

// ANCHOR: Other

export type FlowRunNodeStartEvent = {
  type: FlowRunEventType.NodeStart;
  nodeId: string;
  runFlowStates: RunFlowStates;
};

export type FlowRunNodeFinishEvent = {
  type: FlowRunEventType.NodeFinish;
  nodeId: string;
  runFlowStates: RunFlowStates;
};

export type FlowRunVariableValuesEvent = {
  type: FlowRunEventType.VariableValues;
  conditionResults: ConditionResultRecords;
  variableResults: VariableResultRecords;
};

export type FlowRunNodeErrorsEvent = {
  type: FlowRunEventType.NodeErrors;
  nodeId: string;
  errorMessages: ReadonlyArray<string>;
};

// ANCHOR: Union Event

export type FlowRunEvent =
  | FlowRunValidationErrorsEvent
  | FlowRunNodeStartEvent
  | FlowRunNodeFinishEvent
  | FlowRunVariableValuesEvent
  | FlowRunNodeErrorsEvent;

// ANCHOR: Flow Batch Run Event

export enum FlowBatchRunEventType {
  ValidationErrors = 'ValidationErrors',
  FlowStart = 'FlowStart',
  FlowFinish = 'FlowFinish',
  FlowVariableValues = 'FlowVariableValues',
  FlowErrors = 'FlowErrors',
}

export type FlowBatchRunValidationErrorsEvent = {
  type: FlowBatchRunEventType.ValidationErrors;
  errors: ReadonlyArray<ValidationError>;
};

export type FlowBatchRunFlowStartEvent = {
  type: FlowBatchRunEventType.FlowStart;
  iterationIndex: number;
  rowIndex: number;
};

export type FlowBatchRunFlowFinishEvent = {
  type: FlowBatchRunEventType.FlowFinish;
  iterationIndex: number;
  rowIndex: number;
};

export type FlowBatchRunFlowVariableValuesEvent = {
  type: FlowBatchRunEventType.FlowVariableValues;
  iterationIndex: number;
  rowIndex: number;
  changes: Readonly<Record<string, unknown>>;
};

export type FlowBatchRunFlowErrorEvent = {
  type: FlowBatchRunEventType.FlowErrors;
  iterationIndex: number;
  rowIndex: number;
  errorMessage: string;
};

export type FlowBatchRunEvent =
  | FlowBatchRunValidationErrorsEvent
  | FlowBatchRunFlowStartEvent
  | FlowBatchRunFlowFinishEvent
  | FlowBatchRunFlowVariableValuesEvent
  | FlowBatchRunFlowErrorEvent;

// ANCHOR: Run Flow Progress Event

export enum RunNodeProgressEventType {
  RunFlowInit = 'RunFlowInit',
  Started = 'Started',
  Updated = 'Updated',
  Finished = 'Finished',
}

// Run Flow Init

export type RunFlowInitEvent = {
  type: RunNodeProgressEventType.RunFlowInit;
  initialRunFlowStates: RunFlowStates;
};

// Started

export type RunNodeStartedEvent = {
  type: RunNodeProgressEventType.Started;
  nodeId: string;
  nodeParams: NodeParams;
  runFlowStates: RunFlowStates;
};

// Updated

export type RunNodeUpdatedEvent = {
  type: RunNodeProgressEventType.Updated;
  nodeId: string;
  result: ProgressUpdateData;
};

export type ProgressUpdateData = Partial<{
  errors: string[];
  variableValues: VariableResultRecords;
  conditionResults: ConditionResultRecords;
}>;

// Finished

export type RunNodeFinishedEvent = {
  type: RunNodeProgressEventType.Finished;
  nodeId: string;
  runFlowStates: RunFlowStates;
};

export type RunNodeProgressEvent =
  | RunFlowInitEvent
  | RunNodeStartedEvent
  | RunNodeUpdatedEvent
  | RunNodeFinishedEvent;

// ANCHOR: Run Flow Result

type VariableRawValueRecords = Record<string, unknown>;

export type RunFlowResult = {
  errors: string[];
  variableValues: VariableRawValueRecords;
};
