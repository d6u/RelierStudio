import { css } from '@emotion/react';
import { Option, Select } from '@mui/joy';

import type {
  NodeConfigSelectFieldConfig,
  NodeConfigSelectFieldDefinition,
} from 'canvas-data-base';

import NodeFieldConfigSectionRegularHeader from '../components/NodeFieldConfigSectionRegularHeader';
import useSetFieldConfigImmerAtom from '../util/useSetNoteFieldConfigImmerAtom';

type Props<T> = {
  nodeId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldSchema: Zod.Schema;
  fieldIndex: number;
  fieldDef: NodeConfigSelectFieldDefinition<T>;
  hasMultipleOptions: boolean;
  fieldConfigSectionIndex: number;
};

function NodeSelectFieldConfigSection<T>(props: Props<T>) {
  const [fieldConfig, setFieldConfig] = useSetFieldConfigImmerAtom<
    NodeConfigSelectFieldConfig<T>
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
      <Select
        id={props.fieldKey}
        value={String(fieldConfig.value)}
        onChange={(_event, value) => {
          setFieldConfig((draft) => {
            draft.value = value as T;
          });
        }}
      >
        {props.fieldDef.options.map((option) => (
          <Option key={option.label} value={String(option.value)}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default NodeSelectFieldConfigSection;
