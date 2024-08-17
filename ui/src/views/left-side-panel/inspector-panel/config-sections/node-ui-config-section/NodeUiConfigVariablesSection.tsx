import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button } from '@mui/joy';
import invariant from 'tiny-invariant';

import { NodeDefinitionConfigSectionUIType } from 'canvas-data-base';
import type { NodeConfig } from 'canvas-data-unified';

import { addConnectorForUiConfigSection } from '../../../../../states/actions/add-connector';
import { removeConnectorOnNode } from '../../../../../states/actions/remove-connector-on-node';
import NodeVariableEditorItem from '../components/NodeVariableEditorItem';

type Props = {
  nodeConfig: NodeConfig;
  type:
    | NodeDefinitionConfigSectionUIType.StartNodeVariables
    | NodeDefinitionConfigSectionUIType.FinishNodeVariables
    | NodeDefinitionConfigSectionUIType.InputVariables
    | NodeDefinitionConfigSectionUIType.OutputVariables;
};

function NodeUiConfigVariablesSection(props: Props) {
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
          {(() => {
            switch (props.type) {
              case NodeDefinitionConfigSectionUIType.StartNodeVariables:
                return 'Start Input Variables';
              case NodeDefinitionConfigSectionUIType.FinishNodeVariables:
                return 'Finish Output Variables';
              case NodeDefinitionConfigSectionUIType.InputVariables:
                return 'Node Input Variables';
              case NodeDefinitionConfigSectionUIType.OutputVariables:
                return 'Node Output Variables';
            }
          })()}
        </div>
        {props.type !== NodeDefinitionConfigSectionUIType.OutputVariables && (
          <Button
            variant="plain"
            onClick={() => {
              invariant(
                props.type !==
                  NodeDefinitionConfigSectionUIType.OutputVariables,
                "Should not render Add button for 'OutputVariables'",
              );

              addConnectorForUiConfigSection({
                nodeId: props.nodeConfig.nodeId,
                sectionType: props.type,
              });
            }}
          >
            Add
          </Button>
        )}
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          padding: 0 10px;
        `}
      >
        {(() => {
          switch (props.type) {
            case NodeDefinitionConfigSectionUIType.StartNodeVariables:
              return props.nodeConfig.outputVariableIds.map((variableId) => (
                <VariableEditorWrapper key={variableId}>
                  <NodeVariableEditorItem
                    variableId={variableId}
                    onDelete={() => {
                      removeConnectorOnNode({
                        nodeId: props.nodeConfig.nodeId,
                        connectorId: variableId,
                      });
                    }}
                  />
                </VariableEditorWrapper>
              ));
            case NodeDefinitionConfigSectionUIType.FinishNodeVariables:
            case NodeDefinitionConfigSectionUIType.InputVariables:
              return props.nodeConfig.inputVariableIds.map((variableId) => (
                <VariableEditorWrapper key={variableId}>
                  <NodeVariableEditorItem
                    variableId={variableId}
                    onDelete={() => {
                      removeConnectorOnNode({
                        nodeId: props.nodeConfig.nodeId,
                        connectorId: variableId,
                      });
                    }}
                  />
                </VariableEditorWrapper>
              ));
            case NodeDefinitionConfigSectionUIType.OutputVariables:
              return props.nodeConfig.outputVariableIds.map((variableId) => (
                <VariableEditorWrapper key={variableId}>
                  <NodeVariableEditorItem
                    variableId={variableId}
                    readonlyNameInput={true}
                  />
                </VariableEditorWrapper>
              ));
          }
        })()}
      </div>
    </div>
  );
}

const VariableEditorWrapper = styled.div`
  margin-bottom: 10px;
`;

// case NodeConfigFieldType.OutgoingConditionList:
//       return (
//         <NodeOutgoingConditionListFieldConfigSection
//           nodeId={props.nodeConfig.nodeId}
//           fieldKey={fieldKey}
//           fieldLabel={props.fieldConfigSection.label}
//           fieldSchema={props.fieldConfigSection.schema}
//           fieldIndex={field.index}
//           fieldDef={fieldDef as NodeConfigOutgoingConditionListFieldDefinition}
//           hasMultipleOptions={hasMultipleOptions}
//           fieldConfigSectionIndex={props.fieldConfigSectionIndex}
//         />
//       );

export default NodeUiConfigVariablesSection;
