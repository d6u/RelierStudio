import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, IconButton } from '@mui/joy';

import {
  LlmMessageContentSource,
  LlmMessageRole,
  type NodeConfigLlmMessagesFieldConfig,
  type NodeConfigLlmMessagesFieldDefinition,
} from 'canvas-data-base';
import randomId from 'common-utils/randomId';

import IconArrowLeftArrowRight from '../../../../../../icons/IconArrowLeftArrowRight';
import {
  addInputVariableForFieldConfig,
  deleteLlmMessageConfig,
  deleteVariableForConfigFieldWithVariableIds,
  switchConfigFieldActiveConfig,
  switchLlmMessageConfigContentSourceType,
} from '../../../../../../states/actions/field-config';
import NodeVariableEditorItem from '../../components/NodeVariableEditorItem';
import LlmMessageConfigItem from '../llm-messages-field-components/LlmMessageConfigItem';
import useSetFieldConfigImmerAtom from '../util/useSetNoteFieldConfigImmerAtom';

type Props = {
  nodeId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldSchema: Zod.Schema;
  fieldIndex: number;
  fieldDef: NodeConfigLlmMessagesFieldDefinition;
  hasMultipleOptions: boolean;
  fieldConfigSectionIndex: number;
};

function NodeLlmMessagesFieldConfigSection(props: Props) {
  const [fieldConfig, setFieldConfig] =
    useSetFieldConfigImmerAtom<NodeConfigLlmMessagesFieldConfig>(
      props.nodeId,
      props.fieldKey,
      props.fieldIndex,
    );

  return (
    <div
      css={css`
        background-color: #e6edf4;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #d3e0f3;
          padding: 5px 10px;
        `}
      >
        <div
          css={css`
            font-size: 16px;
            font-weight: 500;
          `}
        >
          {props.fieldLabel}
        </div>
        {props.hasMultipleOptions && (
          <IconButton
            css={css`
              width: 24px;
              height: 24px;
            `}
            variant="plain"
            onClick={() => {
              switchConfigFieldActiveConfig({
                nodeId: props.nodeId,
                fieldConfigSectionIndex: props.fieldConfigSectionIndex,
                fieldKey: props.fieldKey,
              });
            }}
          >
            <IconArrowLeftArrowRight
              css={css`
                width: 16px;
                height: 16px;
              `}
            />
          </IconButton>
        )}
      </div>
      <div
        css={css`
          padding: 0 10px;
        `}
      >
        <SubSectionContainer
          css={css`
            border-bottom: 1px solid #d9d9d9;
          `}
        >
          <SubSectionHeaderContainer>
            <SubSectionHeader>Template Variables</SubSectionHeader>
            <Button
              css={css`
                color: #6daadb;
              `}
              variant="plain"
              onClick={() => {
                addInputVariableForFieldConfig<NodeConfigLlmMessagesFieldConfig>(
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
          </SubSectionHeaderContainer>
          <div
            css={css`
              display: flex;
              flex-direction: column;
            `}
          >
            {fieldConfig.variableIds.map((variableId) => (
              <div
                key={variableId}
                css={css`
                  margin-bottom: 10px;
                `}
              >
                <NodeVariableEditorItem
                  variableId={variableId}
                  onDelete={() => {
                    deleteVariableForConfigFieldWithVariableIds<NodeConfigLlmMessagesFieldConfig>(
                      {
                        nodeId: props.nodeId,
                        fieldKey: props.fieldKey,
                        fieldIndex: props.fieldIndex,
                        variableId: variableId,
                      },
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </SubSectionContainer>
        <SubSectionContainer>
          <SubSectionHeaderContainer>
            <SubSectionHeader>Message Configurations</SubSectionHeader>
            <Button
              css={css`
                color: #6daadb;
              `}
              variant="plain"
              onClick={() => {
                setFieldConfig((draft) => {
                  draft.messages.push({
                    id: randomId(),
                    role: LlmMessageRole.user,
                    contentSourceType: LlmMessageContentSource.Inline,
                    contentInline: '',
                    contentVariableId: null,
                  });
                });
              }}
            >
              Add
            </Button>
          </SubSectionHeaderContainer>
          <div
            css={css`
              display: flex;
              flex-direction: column;
            `}
          >
            {fieldConfig.messages.map((message, index) => (
              <div
                key={message.id}
                css={css`
                  margin-bottom: 10px;
                `}
              >
                <LlmMessageConfigItem
                  messageConfig={message}
                  onContentSourceChange={(contentSourceType) => {
                    switchLlmMessageConfigContentSourceType({
                      nodeId: props.nodeId,
                      fieldKey: props.fieldKey,
                      fieldIndex: props.fieldIndex,
                      messageConfigIndex: index,
                      contentSourceType,
                    });
                  }}
                  onContentInlineChange={(contentInline) => {
                    setFieldConfig((draft) => {
                      draft.messages[index].contentInline = contentInline;
                    });
                  }}
                  onRoleChange={(role) => {
                    setFieldConfig((draft) => {
                      draft.messages[index].role = role;
                    });
                  }}
                  onDelete={() => {
                    deleteLlmMessageConfig({
                      nodeId: props.nodeId,
                      fieldKey: props.fieldKey,
                      fieldIndex: props.fieldIndex,
                      messageConfigIndex: index,
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </SubSectionContainer>
      </div>
    </div>
  );
}

const SubSectionContainer = styled.div``;

const SubSectionHeaderContainer = styled.div`
  height: 42px;
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SubSectionHeader = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

export default NodeLlmMessagesFieldConfigSection;
