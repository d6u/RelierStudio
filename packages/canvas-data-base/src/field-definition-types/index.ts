import type { NodeConfigCanvasConfigFieldDefinition } from './definitions/NodeConfigCanvasConfigFieldDefinition';
import type { NodeConfigCheckboxFieldDefinition } from './definitions/NodeConfigCheckboxFieldDefinition';
import type { NodeConfigInputVariableFieldDefinition } from './definitions/NodeConfigInputVariableFieldDefinition';
import type { NodeConfigInputVariableListFieldDefinition } from './definitions/NodeConfigInputVariableListFieldDefinition';
import type { NodeConfigLlmMessagesFieldDefinition } from './definitions/NodeConfigLlmMessagesFieldDefinition';
import type { NodeConfigNumberFieldDefinition } from './definitions/NodeConfigNumberFieldDefinition';
import type { NodeConfigRadioFieldDefinition } from './definitions/NodeConfigRadioFieldDefinition';
import type { NodeConfigSelectFieldDefinition } from './definitions/NodeConfigSelectFieldDefinition';
import type { NodeConfigStopSequenceFieldDefinition } from './definitions/NodeConfigStopSequenceFieldDefinition';
import type { NodeConfigSubroutineStartSelectFieldDefinition } from './definitions/NodeConfigSubroutineStartSelectFieldDefinition';
import type { NodeConfigTextFieldDefinition } from './definitions/NodeConfigTextFieldDefinition';
import type { NodeConfigTextareaFieldDefinition } from './definitions/NodeConfigTextareaFieldDefinition';
import type { NodeConfigTextareasWithOutputVariablesFieldDefinition } from './definitions/NodeConfigTextareasWithOutputVariablesFieldDefinition';

export type NodeConfigFieldDefinition<T> =
  | NodeConfigCanvasConfigFieldDefinition<T>
  | NodeConfigCheckboxFieldDefinition<T>
  | NodeConfigInputVariableFieldDefinition<T>
  | NodeConfigInputVariableListFieldDefinition<T>
  | NodeConfigLlmMessagesFieldDefinition<T>
  | NodeConfigTextareasWithOutputVariablesFieldDefinition<T>
  | NodeConfigNumberFieldDefinition<T>
  | NodeConfigRadioFieldDefinition<T>
  | NodeConfigSelectFieldDefinition<T>
  | NodeConfigStopSequenceFieldDefinition<T>
  | NodeConfigSubroutineStartSelectFieldDefinition<T>
  | NodeConfigTextareaFieldDefinition<T>
  | NodeConfigTextFieldDefinition<T>;

export * from './NodeConfigFieldType';

export * from './definitions/NodeConfigCanvasConfigFieldDefinition';
export * from './definitions/NodeConfigCheckboxFieldDefinition';
export * from './definitions/NodeConfigInputVariableFieldDefinition';
export * from './definitions/NodeConfigInputVariableListFieldDefinition';
export * from './definitions/NodeConfigLlmMessagesFieldDefinition';
export * from './definitions/NodeConfigTextareasWithOutputVariablesFieldDefinition';
export * from './definitions/NodeConfigNumberFieldDefinition';
export * from './definitions/NodeConfigRadioFieldDefinition';
export * from './definitions/NodeConfigSelectFieldDefinition';
export * from './definitions/NodeConfigStopSequenceFieldDefinition';
export * from './definitions/NodeConfigSubroutineStartSelectFieldDefinition';
export * from './definitions/NodeConfigTextareaFieldDefinition';
export * from './definitions/NodeConfigTextFieldDefinition';
