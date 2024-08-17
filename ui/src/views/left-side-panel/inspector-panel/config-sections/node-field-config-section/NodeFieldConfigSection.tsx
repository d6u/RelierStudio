import {
  type NodeConfigCanvasConfigFieldDefinition,
  type NodeConfigCheckboxFieldDefinition,
  NodeConfigFieldType,
  type NodeConfigInputVariableFieldDefinition,
  type NodeConfigInputVariableListFieldDefinition,
  type NodeConfigLlmMessagesFieldDefinition,
  type NodeConfigNumberFieldDefinition,
  type NodeConfigSelectFieldDefinition,
  type NodeConfigStopSequenceFieldDefinition,
  type NodeConfigSubroutineStartSelectFieldDefinition,
  type NodeConfigTextFieldDefinition,
  type NodeConfigTextareaFieldDefinition,
} from 'canvas-data-base';
import { type NodeConfig } from 'canvas-data-unified';

import NodeCanvasConfigFieldConfigSection from './NodeCanvasConfigFieldConfigSection';
import NodeCheckboxFieldConfigSection from './NodeCheckboxFieldConfigSection';
import NodeInputVariableFieldConfigSection from './NodeInputVariableFieldConfigSection';
import NodeInputVariableListFieldConfigSection from './NodeInputVariableListFieldConfigSection';
import NodeLlmMessagesFieldConfigSection from './NodeLlmMessagesFieldConfigSection';
import NodeNumberFieldConfigSection from './NodeNumberFieldConfigSection';
import NodeSelectFieldConfigSection from './NodeSelectFieldConfigSection';
import NodeStopSequenceFieldConfigSection from './NodeStopSequenceFieldConfigSection';
import NodeSubroutineStartSelectFieldConfigSection from './NodeSubroutineStartSelectFieldConfigSection';
import NodeTextFieldConfigSection from './NodeTextFieldConfigSection';
import NodeTextareaFieldConfigSection from './NodeTextareaFieldConfigSection';
import { FieldConfigSection, NodeConfigFieldKey } from './util/types';

type Props = {
  nodeConfig: NodeConfig;
  fieldConfigSection: FieldConfigSection;
  fieldConfigSectionIndex: number;
};

function NodeFieldConfigSection(props: Props) {
  const fieldKey = props.fieldConfigSection.key as NodeConfigFieldKey;
  const field = props.nodeConfig.fields[fieldKey];
  const fieldDef = props.fieldConfigSection.options[field.index];
  const fieldDefOptionsLength = props.fieldConfigSection.options.length;
  const hasMultipleOptions = fieldDefOptionsLength > 1;

  switch (fieldDef.type) {
    case NodeConfigFieldType.Text:
      return (
        <NodeTextFieldConfigSection
          nodeId={props.nodeConfig.nodeId}
          fieldKey={fieldKey}
          fieldLabel={props.fieldConfigSection.label}
          fieldSchema={props.fieldConfigSection.schema}
          fieldIndex={field.index}
          fieldDef={fieldDef as NodeConfigTextFieldDefinition<unknown>}
          hasMultipleOptions={hasMultipleOptions}
          fieldConfigSectionIndex={props.fieldConfigSectionIndex}
        />
      );
    case NodeConfigFieldType.Textarea:
      return (
        <NodeTextareaFieldConfigSection
          nodeId={props.nodeConfig.nodeId}
          fieldKey={fieldKey}
          fieldLabel={props.fieldConfigSection.label}
          fieldSchema={props.fieldConfigSection.schema}
          fieldIndex={field.index}
          fieldDef={fieldDef as NodeConfigTextareaFieldDefinition<unknown>}
          hasMultipleOptions={hasMultipleOptions}
          fieldConfigSectionIndex={props.fieldConfigSectionIndex}
        />
      );
    case NodeConfigFieldType.Number:
      return (
        <NodeNumberFieldConfigSection
          nodeId={props.nodeConfig.nodeId}
          fieldKey={fieldKey}
          fieldLabel={props.fieldConfigSection.label}
          fieldSchema={props.fieldConfigSection.schema}
          fieldIndex={field.index}
          fieldDef={fieldDef as NodeConfigNumberFieldDefinition<unknown>}
          hasMultipleOptions={hasMultipleOptions}
          fieldConfigSectionIndex={props.fieldConfigSectionIndex}
        />
      );
    case NodeConfigFieldType.Radio:
      return <div>Radio</div>;
    case NodeConfigFieldType.Select:
      return (
        <NodeSelectFieldConfigSection
          nodeId={props.nodeConfig.nodeId}
          fieldKey={fieldKey}
          fieldLabel={props.fieldConfigSection.label}
          fieldSchema={props.fieldConfigSection.schema}
          fieldIndex={field.index}
          fieldDef={fieldDef as NodeConfigSelectFieldDefinition<unknown>}
          hasMultipleOptions={hasMultipleOptions}
          fieldConfigSectionIndex={props.fieldConfigSectionIndex}
        />
      );
    case NodeConfigFieldType.Checkbox:
      return (
        <NodeCheckboxFieldConfigSection
          nodeId={props.nodeConfig.nodeId}
          fieldKey={fieldKey}
          fieldLabel={props.fieldConfigSection.label}
          fieldSchema={props.fieldConfigSection.schema}
          fieldIndex={field.index}
          fieldDef={fieldDef as NodeConfigCheckboxFieldDefinition<unknown>}
          hasMultipleOptions={hasMultipleOptions}
          fieldConfigSectionIndex={props.fieldConfigSectionIndex}
        />
      );
    case NodeConfigFieldType.CanvasConfig:
      return (
        <NodeCanvasConfigFieldConfigSection
          nodeId={props.nodeConfig.nodeId}
          fieldKey={fieldKey}
          fieldLabel={props.fieldConfigSection.label}
          fieldSchema={props.fieldConfigSection.schema}
          fieldIndex={field.index}
          fieldDef={fieldDef as NodeConfigCanvasConfigFieldDefinition}
          hasMultipleOptions={hasMultipleOptions}
          fieldConfigSectionIndex={props.fieldConfigSectionIndex}
        />
      );
    case NodeConfigFieldType.InputVariable:
      return (
        <NodeInputVariableFieldConfigSection
          nodeId={props.nodeConfig.nodeId}
          fieldKey={fieldKey}
          fieldLabel={props.fieldConfigSection.label}
          fieldSchema={props.fieldConfigSection.schema}
          fieldIndex={field.index}
          fieldDef={fieldDef as NodeConfigInputVariableFieldDefinition}
          hasMultipleOptions={hasMultipleOptions}
          fieldConfigSectionIndex={props.fieldConfigSectionIndex}
        />
      );
    case NodeConfigFieldType.InputVariableList:
      return (
        <NodeInputVariableListFieldConfigSection
          nodeId={props.nodeConfig.nodeId}
          fieldKey={fieldKey}
          fieldLabel={props.fieldConfigSection.label}
          fieldSchema={props.fieldConfigSection.schema}
          fieldIndex={field.index}
          fieldDef={fieldDef as NodeConfigInputVariableListFieldDefinition}
          hasMultipleOptions={hasMultipleOptions}
          fieldConfigSectionIndex={props.fieldConfigSectionIndex}
        />
      );
    case NodeConfigFieldType.LlmMessages:
      return (
        <NodeLlmMessagesFieldConfigSection
          nodeId={props.nodeConfig.nodeId}
          fieldKey={fieldKey}
          fieldLabel={props.fieldConfigSection.label}
          fieldSchema={props.fieldConfigSection.schema}
          fieldIndex={field.index}
          fieldDef={fieldDef as NodeConfigLlmMessagesFieldDefinition}
          hasMultipleOptions={hasMultipleOptions}
          fieldConfigSectionIndex={props.fieldConfigSectionIndex}
        />
      );
    case NodeConfigFieldType.StopSequence:
      return (
        <NodeStopSequenceFieldConfigSection
          nodeId={props.nodeConfig.nodeId}
          fieldKey={fieldKey}
          fieldLabel={props.fieldConfigSection.label}
          fieldSchema={props.fieldConfigSection.schema}
          fieldIndex={field.index}
          fieldDef={fieldDef as NodeConfigStopSequenceFieldDefinition}
          hasMultipleOptions={hasMultipleOptions}
          fieldConfigSectionIndex={props.fieldConfigSectionIndex}
        />
      );
    case NodeConfigFieldType.SubroutineStartSelect:
      return (
        <NodeSubroutineStartSelectFieldConfigSection
          nodeId={props.nodeConfig.nodeId}
          fieldKey={fieldKey}
          fieldLabel={props.fieldConfigSection.label}
          fieldSchema={props.fieldConfigSection.schema}
          fieldIndex={field.index}
          fieldDef={fieldDef as NodeConfigSubroutineStartSelectFieldDefinition}
          hasMultipleOptions={hasMultipleOptions}
          fieldConfigSectionIndex={props.fieldConfigSectionIndex}
        />
      );
  }
}

export default NodeFieldConfigSection;
