import { z } from 'zod';

import { ConnectorType } from './ConnectorType';

export const ConditionRuleType = {
  Group: 'Group',
  Structured: 'Structured',
  JSONataExpression: 'JSONataExpression',
} as const;

export type ConditionRuleTypeEnum =
  (typeof ConditionRuleType)[keyof typeof ConditionRuleType];

// NOTE: Structured Condition Rule

export const StructuredConditionOperatorType = {
  EQUALS: 'EQUALS',
  NOT_EQUALS: 'NOT_EQUALS',
  CONTAINS: 'CONTAINS',
  NOT_CONTAINS: 'NOT_CONTAINS',
} as const;

export type StructuredConditionOperatorTypeEnum =
  (typeof StructuredConditionOperatorType)[keyof typeof StructuredConditionOperatorType];

export const StructuredConditionRightHandValueType = {
  INLINE: 'INLINE',
  INPUT_VARIABLE: 'INPUT_VARIABLE',
} as const;

export type StructuredConditionRightHandValueTypeEnum =
  (typeof StructuredConditionRightHandValueType)[keyof typeof StructuredConditionRightHandValueType];

export type StructuredConditionRule = {
  type: typeof ConditionRuleType.Structured;
  leftHandVariableId: string | null;
  operator: StructuredConditionOperatorTypeEnum;
  rightHandValueType: StructuredConditionRightHandValueTypeEnum;
  rightHandInlineValue: string;
  rightHandVariableId: string | null;
};

// NOTE: Expression Condition Rule

export type JSONataExpressionConditionRule = {
  type: typeof ConditionRuleType.JSONataExpression;
  expressionString: string;
};

// NOTE: Group Condition Rule

export const GroupOperatorType = {
  AND: 'AND',
  OR: 'OR',
} as const;

export type GroupOperatorTypeEnum =
  (typeof GroupOperatorType)[keyof typeof GroupOperatorType];

export type GroupConditionRule = {
  type: typeof ConditionRuleType.Group;
  operator: GroupOperatorTypeEnum;
  rules: ConditionRule[];
};

// NOTE: Union

export type ConditionRule =
  | StructuredConditionRule
  | JSONataExpressionConditionRule
  | GroupConditionRule;

// NOTE: Schemas

export const SimpleConditionRuleSchema = z.object({
  type: z.literal(ConditionRuleType.Structured),
  leftHandVariableId: z.string().nullable(),
  operator: z.nativeEnum(StructuredConditionOperatorType),
  rightHandValueType: z.nativeEnum(StructuredConditionRightHandValueType),
  rightHandInlineValue: z.string(),
  rightHandVariableId: z.string().nullable(),
});

export const ExpressionConditionRuleSchema = z.object({
  type: z.literal(ConditionRuleType.JSONataExpression),
  expressionString: z.string(),
});

export const GroupConditionRuleSchema: z.ZodType<GroupConditionRule> = z.object(
  {
    type: z.literal(ConditionRuleType.Group),
    operator: z.nativeEnum(GroupOperatorType),
    rules: z.lazy(() => z.array(ConditionRuleSchema)),
  },
);

export const ConditionRuleSchema = z.union([
  SimpleConditionRuleSchema,
  ExpressionConditionRuleSchema,
  GroupConditionRuleSchema,
]);

export const OutgoingConditionSchema = z.object({
  type: z.literal(ConnectorType.OutgoingCondition),
  id: z.string(),
  nodeId: z.string(),
  key: z.string().optional(),
  name: z.string().optional(),
  rule: GroupConditionRuleSchema.optional(),
});
