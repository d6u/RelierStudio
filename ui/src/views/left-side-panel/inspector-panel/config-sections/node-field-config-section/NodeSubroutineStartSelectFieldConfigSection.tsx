import { css } from '@emotion/react';
import { Option, Select } from '@mui/joy';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import {
  type NodeConfigSubroutineStartSelectFieldConfig,
  type NodeConfigSubroutineStartSelectFieldDefinition,
  NodeKind,
} from 'canvas-data-base';

import { canvasNodeConfigsAtom } from '../../../../../states/atoms/canvas-data';
import NodeFieldConfigSectionRegularHeader from './components/NodeFieldConfigSectionRegularHeader';
import useSetFieldConfigImmerAtom from './util/useSetNoteFieldConfigImmerAtom';

type Props = {
  nodeId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldSchema: Zod.Schema;
  fieldIndex: number;
  fieldDef: NodeConfigSubroutineStartSelectFieldDefinition;
  hasMultipleOptions: boolean;
  fieldConfigSectionIndex: number;
};

function NodeSubroutineStartSelectFieldConfigSection(props: Props) {
  const [fieldConfig, setFieldConfig] =
    useSetFieldConfigImmerAtom<NodeConfigSubroutineStartSelectFieldConfig>(
      props.nodeId,
      props.fieldKey,
      props.fieldIndex,
    );

  const nodeConfigs = useAtomValue(canvasNodeConfigsAtom);

  const subroutineStartNodeConfigs = useMemo(() => {
    return Object.values(nodeConfigs).filter((nodeConfig) => {
      return nodeConfig.kind === NodeKind.SubroutineStart;
    });
  }, [nodeConfigs]);

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
        placeholder="Select a Subroutine Start node"
        value={fieldConfig.nodeId}
        onChange={(_event, value) => {
          setFieldConfig((draft) => {
            draft.nodeId = value;
          });
        }}
      >
        {subroutineStartNodeConfigs.map((nodeConfig) => (
          <Option key={nodeConfig.nodeId} value={nodeConfig.nodeId}>
            {nodeConfig.name}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default NodeSubroutineStartSelectFieldConfigSection;
