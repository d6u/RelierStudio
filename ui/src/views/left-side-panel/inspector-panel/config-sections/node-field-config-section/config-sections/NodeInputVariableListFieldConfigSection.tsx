import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button } from '@mui/joy';

import type {
  NodeConfigInputVariableListFieldConfig,
  NodeConfigInputVariableListFieldDefinition,
} from 'canvas-data-base';

import {
  addInputVariableForFieldConfig,
  deleteVariableForConfigFieldWithVariableIds,
} from '../../../../../../states/actions/field-config';
import NodeVariableEditorItem from '../../components/NodeVariableEditorItem';
import useSetFieldConfigImmerAtom from '../util/useSetNoteFieldConfigImmerAtom';

type Props = {
  nodeId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldSchema: Zod.Schema;
  fieldIndex: number;
  fieldDef: NodeConfigInputVariableListFieldDefinition;
  hasMultipleOptions: boolean;
  fieldConfigSectionIndex: number;
};

function NodeInputVariableListFieldConfigSection(props: Props) {
  const [fieldConfig] =
    useSetFieldConfigImmerAtom<NodeConfigInputVariableListFieldConfig>(
      props.nodeId,
      props.fieldKey,
      props.fieldIndex,
    );

  return (
    <div
      css={css`
        background-color: #f5f5f5;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 10px;
        `}
      >
        <div
          css={css`
            font-size: 14px;
            font-weight: 500;
            line-height: 32px;
          `}
        >
          Input Variables
        </div>
        <Button
          variant="plain"
          onClick={() => {
            addInputVariableForFieldConfig<NodeConfigInputVariableListFieldConfig>(
              {
                nodeId: props.nodeId,
                fieldKey: props.fieldKey,
                fieldIndex: props.fieldIndex,
              },
            );
          }}
        >
          Add
        </Button>
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          padding: 0 10px;
        `}
      >
        {fieldConfig.variableIds.map((variableId) => (
          <VariableEditorWrapper key={variableId}>
            <NodeVariableEditorItem
              variableId={variableId}
              onDelete={() => {
                deleteVariableForConfigFieldWithVariableIds<NodeConfigInputVariableListFieldConfig>(
                  {
                    nodeId: props.nodeId,
                    fieldKey: props.fieldKey,
                    fieldIndex: props.fieldIndex,
                    variableId: variableId,
                  },
                );
              }}
            />
          </VariableEditorWrapper>
        ))}
      </div>
    </div>
  );
}

const VariableEditorWrapper = styled.div`
  margin-bottom: 10px;
`;

export default NodeInputVariableListFieldConfigSection;
