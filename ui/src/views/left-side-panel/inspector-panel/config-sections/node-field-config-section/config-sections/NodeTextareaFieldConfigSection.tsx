import { css } from '@emotion/react';
import { Textarea } from '@mui/joy';

import type {
  NodeConfigTextareaFieldConfig,
  NodeConfigTextareaFieldDefinition,
} from 'canvas-data-base';

import NodeFieldConfigSectionHelperText from '../components/NodeFieldConfigSectionHelperText';
import NodeFieldConfigSectionRegularHeader from '../components/NodeFieldConfigSectionRegularHeader';
import useSetFieldConfigImmerAtom from '../util/useSetNoteFieldConfigImmerAtom';

type Props<T> = {
  nodeId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldSchema: Zod.Schema;
  fieldIndex: number;
  fieldDef: NodeConfigTextareaFieldDefinition<T>;
  hasMultipleOptions: boolean;
  fieldConfigSectionIndex: number;
};

function NodeTextareaFieldConfigSection<T>(props: Props<T>) {
  const [fieldConfig, setFieldConfig] = useSetFieldConfigImmerAtom<
    NodeConfigTextareaFieldConfig<T>
  >(props.nodeId, props.fieldKey, props.fieldIndex);

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
      <Textarea
        minRows={2}
        value={fieldConfig.value as string}
        onChange={(event) => {
          setFieldConfig((draft) => {
            draft.value = event.target.value as T;
          });
        }}
      />
      <NodeFieldConfigSectionHelperText fieldDef={props.fieldDef} />
    </div>
  );
}

export default NodeTextareaFieldConfigSection;
