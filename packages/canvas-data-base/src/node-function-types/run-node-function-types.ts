import { type Observable } from 'rxjs';

import type { ConditionResult } from '../condition-result-schema-and-type';
import {
  type InputVariable,
  type OutgoingCondition,
  type OutputVariable,
} from '../connector';

export type RunNodeParams<T> = {
  nodeParams: T;
  inputVariables: InputVariable[];
  outputVariables: OutputVariable[];
  outgoingConditions: OutgoingCondition[];
  inputVariableValues: unknown[];
  // run options
  preferStreaming: boolean;
};

export type RunNodeResult = Partial<{
  errors: string[];
  conditionResults: ConditionResult[];
  variableValues: unknown[];
}>;

export type RunNodeFunction<TNodeParams> = (
  params: RunNodeParams<TNodeParams>,
) => Promise<RunNodeResult>;

export type RunNodeObservableFunction<TNodeParams> = (
  params: RunNodeParams<TNodeParams>,
) => Observable<RunNodeResult>;
