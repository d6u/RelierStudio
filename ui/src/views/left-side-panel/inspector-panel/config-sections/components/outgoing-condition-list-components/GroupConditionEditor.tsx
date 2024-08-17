import { css } from '@emotion/react';
import { Button, IconButton, Option, Select, Typography } from '@mui/joy';
import { useSetImmerAtom } from 'jotai-immer';

import {
  type ConditionRule,
  ConditionRuleType,
  type GroupConditionRule,
  GroupOperatorType,
  type OutgoingCondition,
} from 'canvas-data-base';

import IconTrash from '../../../../../../icons/IconTrash';
import { canvasConnectorsAtom } from '../../../../../../states/atoms/canvas-data';
import GroupConditionEditorButtons from './GroupConditionEditorButtons';
import JSONataExpressionCondition from './JSONataExpressionCondition';
import SimpleConditionEditor from './SimpleConditionEditor';
import { getCurrentRule } from './util';

type Props = {
  className?: string;
  condition: OutgoingCondition;
  rule: GroupConditionRule;
  path: number[];
};

function GroupConditionEditor(props: Props) {
  const setConnectors = useSetImmerAtom(canvasConnectorsAtom);

  const subRules = props.rule.rules;

  return (
    <div
      className={props.className}
      css={css`
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 5px;
        // Use alpha value so it becomes darker when nested
        background-color: rgb(214 214 214 / 20%);
        // Use the available space, but not more than max-content
        // max-content is when there is no wrapping
        width: fit-content;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 10px;
        `}
      >
        {subRules.map((rule, index) => {
          return (
            <div
              key={index}
              css={css`
                ${subRules.length > 1 &&
                css`
                  display: grid;
                  grid-template-columns: 75px auto;
                  align-items: start;
                  gap: 5px;
                `}
              `}
            >
              {index === 1 && (
                <Select
                  value={props.rule.operator}
                  onChange={(_event, value) => {
                    setConnectors((draft) => {
                      const currentRule = getCurrentRule<GroupConditionRule>(
                        draft,
                        props.condition.id,
                        props.path,
                      );
                      currentRule.operator = value!;
                    });
                  }}
                >
                  {Object.keys(GroupOperatorType).map((operator) => (
                    <Option key={operator} value={operator}>
                      {operator.toUpperCase()}
                    </Option>
                  ))}
                </Select>
              )}
              {index > 1 && (
                <Typography
                  css={css`
                    color: rgb(23, 26, 28);
                    padding-left: 10px;
                  `}
                  level="body-sm"
                >
                  {props.rule.operator.toUpperCase()}
                </Typography>
              )}
              <SubConditionEditor
                css={css`
                  grid-column: 2 / 3;
                `}
                condition={props.condition}
                rule={rule}
                path={[...props.path, index]}
                onDelete={
                  subRules.length > 1
                    ? () => {
                        setConnectors((draft) => {
                          const currentRule =
                            getCurrentRule<GroupConditionRule>(
                              draft,
                              props.condition.id,
                              props.path,
                            );
                          currentRule.rules.splice(index, 1);
                        });
                      }
                    : undefined
                }
                /**
                 * NOTE: Unwrap handles a case when this group condition
                 * contains only condition that's also a group condition.
                 * In this case, the inner group condition is unnecessary.
                 */
                onUnwrap={
                  subRules.length === 1 && rule.type === ConditionRuleType.Group
                    ? () => {
                        setConnectors((draft) => {
                          const childRules = rule.rules;
                          const currentRule =
                            getCurrentRule<GroupConditionRule>(
                              draft,
                              props.condition.id,
                              props.path,
                            );
                          currentRule.rules.splice(index, 1);
                          currentRule.rules.push(...childRules);
                          currentRule.operator = rule.operator;
                        });
                      }
                    : undefined
                }
              />
            </div>
          );
        })}
      </div>
      <GroupConditionEditorButtons
        condition={props.condition}
        path={props.path}
      />
    </div>
  );
}

type SubConditionEditorProps = {
  className?: string;
  condition: OutgoingCondition;
  rule: ConditionRule;
  path: number[];
  onDelete?: () => void;
  onUnwrap?: () => void;
};

function SubConditionEditor(props: SubConditionEditorProps) {
  return (
    <div
      className={props.className}
      css={css`
        display: flex;
        gap: 5px;
        justify-content: space-between;
        align-items: flex-start;
      `}
    >
      {(() => {
        switch (props.rule.type) {
          case ConditionRuleType.Group:
            /**
             * We don't need `flex-grow: 1;` for GroupConditionEditor,
             * because it's always the widest.
             */
            return (
              <GroupConditionEditor
                condition={props.condition}
                rule={props.rule}
                path={props.path}
              />
            );
          case ConditionRuleType.Structured:
            return (
              <SimpleConditionEditor
                css={css`
                  flex-grow: 1;
                `}
                condition={props.condition}
                rule={props.rule}
                path={props.path}
              />
            );
          case ConditionRuleType.JSONataExpression:
            return (
              <JSONataExpressionCondition
                css={css`
                  flex-grow: 1;
                `}
                condition={props.condition}
                rule={props.rule}
                path={props.path}
              />
            );
        }
      })()}
      {props.onDelete && (
        <IconButton
          variant="plain"
          onClick={() => {
            props.onDelete!();
          }}
        >
          <IconTrash
            css={css`
              width: 16px;
              height: 16px;
            `}
          />
        </IconButton>
      )}
      {props.onUnwrap && (
        <Button
          variant="plain"
          onClick={() => {
            props.onUnwrap!();
          }}
        >
          Unwrap
        </Button>
      )}
    </div>
  );
}

export default GroupConditionEditor;
