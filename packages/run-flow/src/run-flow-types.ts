import type { Observer } from 'rxjs';

import type { CanvasConfigRecords } from 'canvas-config-definitions';
import type {
  ConditionResult,
  InputVariable,
  VariableResult,
} from 'canvas-data-base';
import type { CanvasDataV1 } from 'canvas-data-unified';

import type { RunNodeProgressEvent } from './event-types';

export type EdgeArray = CanvasDataV1['edges'];
export type NodeConfigRecords = CanvasDataV1['nodeConfigs'];
export type ConnectorRecords = CanvasDataV1['connectors'];
export type VariableResultRecords = Record<string, VariableResult>;
export type ConditionResultRecords = Record<string, ConditionResult>;

export type RunFlowParams = Readonly<{
  // canvas data
  edges: EdgeArray;
  nodeConfigs: NodeConfigRecords;
  connectors: ConnectorRecords;
  // run states
  inputVariableResults: VariableResultRecords;
  // canvas config
  canvasConfigs: CanvasConfigRecords;
  // run options
  startNodeId: string;
  preferStreaming: boolean;
  progressObserver?: Observer<RunNodeProgressEvent>;
}>;

export type InputVariableValueFromGraphGetter = (
  variable: InputVariable,
) => unknown;
