import { css } from '@emotion/react';
import { Input, Option, Select } from '@mui/joy';
import { useAtomValue } from 'jotai';
import { useImmerAtom } from 'jotai-immer';
import invariant from 'tiny-invariant';

import {
  ConnectorType,
  type OutgoingCondition,
  StructuredConditionOperatorType,
  type StructuredConditionOperatorTypeEnum,
  StructuredConditionRightHandValueType,
  type StructuredConditionRightHandValueTypeEnum,
  type StructuredConditionRule,
} from 'canvas-data-base';

import {
  canvasConnectorsAtom,
  canvasNodeConfigsAtom,
} from '../../../../../../states/atoms/canvas-data';
import { getCurrentRule } from './util';

const STRUCTURED_CONDITION_RIGHT_HAND_VALUE_TYPE_LABELS: Record<
  StructuredConditionRightHandValueTypeEnum,
  string
> = {
  INLINE: 'Inline Value',
  INPUT_VARIABLE: 'Variable',
};

const STRUCTURED_CONDITION_OPERATOR_LABELS: Record<
  StructuredConditionOperatorTypeEnum,
  string
> = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not equals',
  CONTAINS: 'contains',
  NOT_CONTAINS: 'not contains',
};

const INPUT_CSS = css`
  flex-grow: 1;
`;

type Props = {
  className?: string;
  condition: OutgoingCondition;
  rule: StructuredConditionRule;
  path: number[];
};

function SimpleConditionEditor(props: Props) {
  const nodeConfigs = useAtomValue(canvasNodeConfigsAtom);
  const [connectors, setConnectors] = useImmerAtom(canvasConnectorsAtom);

  const nodeConfig = nodeConfigs[props.condition.nodeId];

  return (
    <div
      className={props.className}
      css={css`
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      `}
    >
      <Select
        css={css`
          ${INPUT_CSS}
        `}
        placeholder="Select input variable"
        value={props.rule.leftHandVariableId}
        onChange={(_event, value) => {
          setConnectors((draft) => {
            const currentRule = getCurrentRule<StructuredConditionRule>(
              draft,
              props.condition.id,
              props.path,
            );
            currentRule.leftHandVariableId = value!;
          });
        }}
      >
        {nodeConfig.inputVariableIds.map((variableId) => {
          const connector = connectors[variableId];
          invariant(
            connector.type === ConnectorType.InputVariable,
            'Connector type must be input variable',
          );
          return (
            <Option key={variableId} value={variableId}>
              {connector.name}
            </Option>
          );
        })}
      </Select>
      <Select
        value={props.rule.operator}
        onChange={(_event, value) => {
          setConnectors((draft) => {
            const currentRule = getCurrentRule<StructuredConditionRule>(
              draft,
              props.condition.id,
              props.path,
            );
            currentRule.operator = value!;
          });
        }}
      >
        {Object.keys(StructuredConditionOperatorType).map((operator) => (
          <Option key={operator} value={operator}>
            {
              STRUCTURED_CONDITION_OPERATOR_LABELS[
                operator as StructuredConditionOperatorTypeEnum
              ]
            }
          </Option>
        ))}
      </Select>
      <Select
        value={props.rule.rightHandValueType}
        onChange={(_event, value) => {
          setConnectors((draft) => {
            const currentRule = getCurrentRule<StructuredConditionRule>(
              draft,
              props.condition.id,
              props.path,
            );
            currentRule.rightHandValueType = value!;
          });
        }}
      >
        {Object.keys(StructuredConditionRightHandValueType).map((valueType) => (
          <Option key={valueType} value={valueType}>
            {
              STRUCTURED_CONDITION_RIGHT_HAND_VALUE_TYPE_LABELS[
                valueType as StructuredConditionRightHandValueTypeEnum
              ]
            }
          </Option>
        ))}
      </Select>
      {(() => {
        switch (props.rule.rightHandValueType) {
          case StructuredConditionRightHandValueType.INLINE:
            return (
              <Input
                css={css`
                  ${INPUT_CSS}
                `}
                placeholder="Enter inline value"
                value={props.rule.rightHandInlineValue}
                onChange={(event) => {
                  setConnectors((draft) => {
                    const currentRule = getCurrentRule<StructuredConditionRule>(
                      draft,
                      props.condition.id,
                      props.path,
                    );

                    currentRule.rightHandInlineValue = event.target.value;
                  });
                }}
              />
            );
          case StructuredConditionRightHandValueType.INPUT_VARIABLE:
            return (
              <Select
                css={css`
                  ${INPUT_CSS}
                `}
                placeholder="Input variable to compare with"
                value={props.rule.rightHandVariableId}
                onChange={(_event, value) => {
                  setConnectors((draft) => {
                    const currentRule = getCurrentRule<StructuredConditionRule>(
                      draft,
                      props.condition.id,
                      props.path,
                    );

                    currentRule.rightHandVariableId = value;
                  });
                }}
              >
                {nodeConfig.inputVariableIds.map((variableId) => {
                  const connector = connectors[variableId];
                  invariant(
                    connector.type === ConnectorType.InputVariable,
                    'Connector type must be input variable',
                  );
                  return (
                    <Option key={variableId} value={variableId}>
                      {connector.name}
                    </Option>
                  );
                })}
              </Select>
            );
        }
      })()}
    </div>
  );
}

export default SimpleConditionEditor;
