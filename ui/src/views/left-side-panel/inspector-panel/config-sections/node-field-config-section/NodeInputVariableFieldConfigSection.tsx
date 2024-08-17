import { css } from '@emotion/react';

import type {
  NodeConfigInputVariableFieldConfig,
  NodeConfigInputVariableFieldDefinition,
} from 'canvas-data-base';

import NodeVariableEditorItem from '../components/NodeVariableEditorItem';
import NodeFieldConfigSectionRegularHeader from './components/NodeFieldConfigSectionRegularHeader';
import useSetFieldConfigImmerAtom from './util/useSetNoteFieldConfigImmerAtom';

type Props = {
  nodeId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldSchema: Zod.Schema;
  fieldIndex: number;
  fieldDef: NodeConfigInputVariableFieldDefinition;
  hasMultipleOptions: boolean;
  fieldConfigSectionIndex: number;
};

function NodeInputVariableFieldConfigSection(props: Props) {
  const [fieldConfig] =
    useSetFieldConfigImmerAtom<NodeConfigInputVariableFieldConfig>(
      props.nodeId,
      props.fieldKey,
      props.fieldIndex,
    );

  return (
    <div
      css={css`
        padding: 0 10px;
      `}
    >
      <NodeFieldConfigSectionRegularHeader
        nodeId={props.nodeId}
        fieldKey={props.fieldKey}
        fieldLabel={props.fieldLabel}
        hasMultipleOptions={props.hasMultipleOptions}
        fieldConfigSectionIndex={props.fieldConfigSectionIndex}
      />
      <NodeVariableEditorItem
        variableId={fieldConfig.variableId!}
        readonlyNameInput
      />
    </div>
  );
}

export default NodeInputVariableFieldConfigSection;
