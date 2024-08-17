import { css } from '@emotion/react';
import { Button, styled } from '@mui/joy';
import { useSetImmerAtom } from 'jotai-immer';

import {
  ConditionRuleType,
  type GroupConditionRule,
  GroupOperatorType,
  type OutgoingCondition,
  StructuredConditionOperatorType,
  StructuredConditionRightHandValueType,
} from 'canvas-data-base';

import { canvasConnectorsAtom } from '../../../../../../states/atoms/canvas-data';
import { getCurrentRule } from './util';

type ButtonsProps = {
  condition: OutgoingCondition;
  path: number[];
};

function GroupConditionEditorButtons(props: ButtonsProps) {
  const setConnectors = useSetImmerAtom(canvasConnectorsAtom);

  return (
    <div
      css={css`
        display: flex;
        gap: 5px;
        margin-top: 10px;
        flex-wrap: wrap;
      `}
    >
      <StyledButton
        variant="plain"
        onClick={() => {
          setConnectors((draft) => {
            const currentRule = getCurrentRule<GroupConditionRule>(
              draft,
              props.condition.id,
              props.path,
            );
            currentRule.rules.push({
              type: ConditionRuleType.Structured,
              leftHandVariableId: null,
              operator: StructuredConditionOperatorType.EQUALS,
              rightHandValueType: StructuredConditionRightHandValueType.INLINE,
              rightHandInlineValue: '',
              rightHandVariableId: null,
            });
          });
        }}
      >
        + Condition
      </StyledButton>
      <StyledButton
        variant="plain"
        onClick={() => {
          setConnectors((draft) => {
            const currentRule = getCurrentRule<GroupConditionRule>(
              draft,
              props.condition.id,
              props.path,
            );
            currentRule.rules.push({
              type: ConditionRuleType.JSONataExpression,
              expressionString: '',
            });
          });
        }}
      >
        + Expression
      </StyledButton>
      <StyledButton
        variant="plain"
        onClick={() => {
          setConnectors((draft) => {
            const currentRule = getCurrentRule<GroupConditionRule>(
              draft,
              props.condition.id,
              props.path,
            );
            currentRule.rules.push({
              type: ConditionRuleType.Group,
              operator: GroupOperatorType.AND,
              rules: [
                {
                  type: ConditionRuleType.Structured,
                  leftHandVariableId: null,
                  operator: StructuredConditionOperatorType.CONTAINS,
                  rightHandValueType:
                    StructuredConditionRightHandValueType.INLINE,
                  rightHandInlineValue: '',
                  rightHandVariableId: null,
                },
              ],
            });
          });
        }}
      >
        + Group
      </StyledButton>
    </div>
  );
}

const StyledButton = styled(Button)`
  font-size: 12px;
  line-height: 14px;
  min-height: 22px;
  padding-left: 4px;
  padding-right: 4px;
`;

export default GroupConditionEditorButtons;
