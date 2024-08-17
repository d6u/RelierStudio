import { css } from '@emotion/react';
import { Input } from '@mui/joy';

import type {
  NodeConfigTextFieldConfig,
  NodeConfigTextFieldDefinition,
} from 'canvas-data-base';

import NodeFieldConfigSectionHelperText from './components/NodeFieldConfigSectionHelperText';
import NodeFieldConfigSectionRegularHeader from './components/NodeFieldConfigSectionRegularHeader';
import useSetFieldConfigImmerAtom from './util/useSetNoteFieldConfigImmerAtom';

type Props<T> = {
  nodeId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldSchema: Zod.Schema;
  fieldIndex: number;
  fieldDef: NodeConfigTextFieldDefinition<T>;
  hasMultipleOptions: boolean;
  fieldConfigSectionIndex: number;
};

function NodeTextFieldConfigSection<T>(props: Props<T>) {
  const [fieldConfig, setFieldConfig] = useSetFieldConfigImmerAtom<
    NodeConfigTextFieldConfig<T>
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
      <Input
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

export default NodeTextFieldConfigSection;
