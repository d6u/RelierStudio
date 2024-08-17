import type { NodeConfigCanvasConfigFieldDefinition } from './NodeConfigCanvasConfigFieldDefinition';
import type { NodeConfigCheckboxFieldDefinition } from './NodeConfigCheckboxFieldDefinition';
import type { NodeConfigInputVariableFieldDefinition } from './NodeConfigInputVariableFieldDefinition';
import type { NodeConfigInputVariableListFieldDefinition } from './NodeConfigInputVariableListFieldDefinition';
import type { NodeConfigLlmMessagesFieldDefinition } from './NodeConfigLlmMessagesFieldDefinition';
import type { NodeConfigNumberFieldDefinition } from './NodeConfigNumberFieldDefinition';
import type { NodeConfigRadioFieldDefinition } from './NodeConfigRadioFieldDefinition';
import type { NodeConfigSelectFieldDefinition } from './NodeConfigSelectFieldDefinition';
import type { NodeConfigStopSequenceFieldDefinition } from './NodeConfigStopSequenceFieldDefinition';
import type { NodeConfigSubroutineStartSelectFieldDefinition } from './NodeConfigSubroutineStartSelectFieldDefinition';
import type { NodeConfigTextFieldDefinition } from './NodeConfigTextFieldDefinition';
import type { NodeConfigTextareaFieldDefinition } from './NodeConfigTextareaFieldDefinition';

export type NodeConfigFieldDefinition<T> =
  | NodeConfigTextFieldDefinition<T>
  | NodeConfigTextareaFieldDefinition<T>
  | NodeConfigNumberFieldDefinition<T>
  | NodeConfigRadioFieldDefinition<T>
  | NodeConfigSelectFieldDefinition<T>
  | NodeConfigCheckboxFieldDefinition<T>
  | NodeConfigCanvasConfigFieldDefinition<T>
  | NodeConfigInputVariableFieldDefinition<T>
  | NodeConfigInputVariableListFieldDefinition<T>
  | NodeConfigLlmMessagesFieldDefinition<T>
  | NodeConfigStopSequenceFieldDefinition<T>
  | NodeConfigSubroutineStartSelectFieldDefinition<T>;

export * from './NodeConfigFieldType';
export * from './NodeConfigTextFieldDefinition';
export * from './NodeConfigTextareaFieldDefinition';
export * from './NodeConfigNumberFieldDefinition';
export * from './NodeConfigRadioFieldDefinition';
export * from './NodeConfigSelectFieldDefinition';
export * from './NodeConfigCheckboxFieldDefinition';
export * from './NodeConfigCanvasConfigFieldDefinition';
export * from './NodeConfigInputVariableFieldDefinition';
export * from './NodeConfigInputVariableListFieldDefinition';
export * from './NodeConfigLlmMessagesFieldDefinition';
export * from './NodeConfigStopSequenceFieldDefinition';
export * from './NodeConfigSubroutineStartSelectFieldDefinition';
