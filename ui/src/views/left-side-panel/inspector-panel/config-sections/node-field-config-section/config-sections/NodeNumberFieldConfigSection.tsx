import { css } from '@emotion/react';
import { Input } from '@mui/joy';

import type {
  NodeConfigNumberFieldConfig,
  NodeConfigNumberFieldDefinition,
} from 'canvas-data-base';

import NodeFieldConfigSectionRegularHeader from '../components/NodeFieldConfigSectionRegularHeader';
import useSetFieldConfigImmerAtom from '../util/useSetNoteFieldConfigImmerAtom';

type Props<T> = {
  nodeId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldSchema: Zod.Schema;
  fieldIndex: number;
  fieldDef: NodeConfigNumberFieldDefinition<T>;
  hasMultipleOptions: boolean;
  fieldConfigSectionIndex: number;
};

function NodeNumberFieldConfigSection<T>(props: Props<T>) {
  const [fieldConfig, setFieldConfig] = useSetFieldConfigImmerAtom<
    NodeConfigNumberFieldConfig<T>
  >(props.nodeId, props.fieldKey, props.fieldIndex);

  const renderFunc =
    props.fieldDef.render ?? (defaultRenderFunc as (value: T) => string);
  const parseFunc =
    props.fieldDef.parse ?? (defaultParseFunc as (value: string) => T);

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
        id={props.fieldKey}
        name={props.fieldKey}
        type="number"
        slotProps={{
          input: {
            min: props.fieldDef.min,
            max: props.fieldDef.max,
            step: props.fieldDef.step,
          },
        }}
        value={renderFunc(fieldConfig.value)}
        onChange={(event) => {
          const value = parseFunc(event.target.value);
          setFieldConfig((draft) => {
            draft.value = value;
          });
        }}
      />
    </div>
  );
}

function defaultRenderFunc(value: number): string {
  return String(value);
}

function defaultParseFunc(value: string): number {
  return Number(value);
}

export default NodeNumberFieldConfigSection;
