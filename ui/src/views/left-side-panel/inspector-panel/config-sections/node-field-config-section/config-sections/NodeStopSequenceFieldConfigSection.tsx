import { css } from '@emotion/react';
import { Input } from '@mui/joy';

import type {
  NodeConfigStopSequenceFieldConfig,
  NodeConfigStopSequenceFieldDefinition,
} from 'canvas-data-base';

import NodeFieldConfigSectionRegularHeader from '../components/NodeFieldConfigSectionRegularHeader';
import useSetFieldConfigImmerAtom from '../util/useSetNoteFieldConfigImmerAtom';

const NEW_LINE_SYMBOL = '↵';

type Props = {
  nodeId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldSchema: Zod.Schema;
  fieldIndex: number;
  fieldDef: NodeConfigStopSequenceFieldDefinition;
  hasMultipleOptions: boolean;
  fieldConfigSectionIndex: number;
};

function NodeStopSequenceFieldConfigSection(props: Props) {
  const [fieldConfig, setFieldConfig] =
    useSetFieldConfigImmerAtom<NodeConfigStopSequenceFieldConfig>(
      props.nodeId,
      props.fieldKey,
      props.fieldIndex,
    );

  const inputValue = fieldConfig.value[0] ?? '';

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
        placeholder="Enter stop sequence"
        value={inputValue.replace(/\n/g, NEW_LINE_SYMBOL)}
        onChange={(event) => {
          const nextValue = event.target.value.replace(NEW_LINE_SYMBOL, '\n');

          setFieldConfig((draft) => {
            draft.value = nextValue === '' ? [] : [nextValue];
          });
        }}
        onKeyDown={(event) => {
          if (event.shiftKey && event.key === 'Enter') {
            event.preventDefault();

            const nextValue = inputValue.replace(NEW_LINE_SYMBOL, '\n');

            setFieldConfig((draft) => {
              draft.value = [nextValue + '\n'];
            });
          }
        }}
      />
    </div>
  );
}

export default NodeStopSequenceFieldConfigSection;
