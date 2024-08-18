import { css } from '@emotion/react';
import { Checkbox } from '@mui/joy';

import type {
  NodeConfigCheckboxFieldConfig,
  NodeConfigCheckboxFieldDefinition,
} from 'canvas-data-base';

import NodeFieldConfigSectionRegularHeader from '../components/NodeFieldConfigSectionRegularHeader';
import useSetFieldConfigImmerAtom from '../util/useSetNoteFieldConfigImmerAtom';

type Props<T> = {
  nodeId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldSchema: Zod.Schema;
  fieldIndex: number;
  fieldDef: NodeConfigCheckboxFieldDefinition<T>;
  hasMultipleOptions: boolean;
  fieldConfigSectionIndex: number;
};

function NodeCheckboxFieldConfigSection<T>(props: Props<T>) {
  const [fieldConfig, setFieldConfig] = useSetFieldConfigImmerAtom<
    NodeConfigCheckboxFieldConfig<T>
  >(props.nodeId, props.fieldKey, props.fieldIndex);

  const renderFunc =
    props.fieldDef.render ?? (defaultRenderFunc as (value: T) => boolean);
  const parseFunc =
    props.fieldDef.parse ?? (defaultParseFunc as (value: boolean) => T);

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
      <Checkbox
        checked={renderFunc(fieldConfig.value)}
        onChange={(event) => {
          setFieldConfig((draft) => {
            draft.value = parseFunc(event.target.checked);
          });
        }}
      />
    </div>
  );
}

function defaultRenderFunc(value: boolean): boolean {
  return value;
}

function defaultParseFunc(value: boolean): boolean {
  return value;
}

export default NodeCheckboxFieldConfigSection;
