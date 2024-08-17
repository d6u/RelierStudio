import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button } from '@mui/joy';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import invariant from 'tiny-invariant';

import { ConnectorType } from 'canvas-data-base';
import type { NodeConfig } from 'canvas-data-unified';

import { addOutgoingConditionForUiConfigSection } from '../../../../../states/actions/add-connector';
import { canvasConnectorsAtom } from '../../../../../states/atoms/canvas-data';
import ConditionRootEditor from '../components/outgoing-condition-list-components/ConditionRootEditor';

type Props = {
  nodeConfig: NodeConfig;
};

function NodeUiOutgoingConditionListSection(props: Props) {
  const connectors = useAtomValue(canvasConnectorsAtom);

  const editableOutgoingConditions = useMemo(() => {
    // NOTE: The first condition is the default one
    return props.nodeConfig.outgoingConditionIds.slice(1).map((conditionId) => {
      const condition = connectors[conditionId];

      invariant(
        condition.type === ConnectorType.OutgoingCondition,
        'Connector must be OutgoingCondition',
      );

      invariant(condition.rule != null, 'OutgoingCondition must have rule');

      return condition;
    });
  }, [connectors, props.nodeConfig.outgoingConditionIds]);

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
          Conditions
        </div>
        <Button
          variant="plain"
          onClick={() => {
            addOutgoingConditionForUiConfigSection({
              nodeId: props.nodeConfig.nodeId,
            });
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
        {editableOutgoingConditions.map((condition) => {
          return (
            <ConditionEditorWrapper key={condition.id}>
              <ConditionRootEditor condition={condition} />
            </ConditionEditorWrapper>
          );
        })}
      </div>
    </div>
  );
}

const ConditionEditorWrapper = styled.div`
  margin-bottom: 10px;
`;

export default NodeUiOutgoingConditionListSection;
