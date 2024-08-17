import { Textarea } from '@mui/joy';
import { useSetImmerAtom } from 'jotai-immer';

import type {
  JSONataExpressionConditionRule,
  OutgoingCondition,
} from 'canvas-data-base';

import { canvasConnectorsAtom } from '../../../../../../states/atoms/canvas-data';
import { getCurrentRule } from './util';

type Props = {
  className?: string;
  condition: OutgoingCondition;
  rule: JSONataExpressionConditionRule;
  path: number[];
};

function JSONataExpressionCondition(props: Props) {
  const setConnectors = useSetImmerAtom(canvasConnectorsAtom);

  return (
    <Textarea
      className={props.className}
      minRows={2}
      placeholder="Enter JSONata expression"
      value={props.rule.expressionString}
      onChange={(event) => {
        setConnectors((draft) => {
          const currentRule = getCurrentRule<JSONataExpressionConditionRule>(
            draft,
            props.condition.id,
            props.path,
          );

          currentRule.expressionString = event.target.value;
        });
      }}
    />
  );
}

export default JSONataExpressionCondition;
