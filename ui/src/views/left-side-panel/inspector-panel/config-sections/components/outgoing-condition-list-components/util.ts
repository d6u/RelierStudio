import invariant from 'tiny-invariant';

import {
  type ConditionRule,
  ConnectorType,
  type GroupConditionRule,
} from 'canvas-data-base';
import type { ConnectorRecords } from 'run-flow';

export function getCurrentRule<T extends ConditionRule>(
  connectors: ConnectorRecords,
  conditionId: string,
  path: number[],
): T {
  const condition = connectors[conditionId];

  invariant(
    condition.type === ConnectorType.OutgoingCondition,
    'Connector must be an outgoing condition',
  );

  let targetRule = condition.rule!;

  path = [...path];
  while (path.length > 0) {
    const index = path.shift()!;
    targetRule = targetRule.rules[index] as GroupConditionRule;
  }

  return targetRule as T;
}
