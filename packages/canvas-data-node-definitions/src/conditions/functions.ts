import jsonata from 'jsonata';
import invariant from 'tiny-invariant';

import {
  type ConditionResult,
  type ConditionRule,
  ConditionRuleType,
  type CreateDefaultCanvasDataContext,
  DEFAULT_CONDITION_KEY,
  type GroupConditionRule,
  GroupOperatorType,
  NodeFunctions,
  StructuredConditionOperatorType,
  StructuredConditionRightHandValueType,
  createIncomingCondition,
  createInputVariable,
  createOutgoingCondition,
} from 'canvas-data-base';

import {
  type ConditionsNodeConfig,
  type ConditionsNodeParams,
  createDefaultConditionsNodeConfig,
} from './node-definition';

export const CONDITIONS_NODE_FUNCTIONS: NodeFunctions<
  ConditionsNodeConfig,
  ConditionsNodeParams
> = {
  createDefaultCanvasData(context: CreateDefaultCanvasDataContext) {
    const nodeId = context.generateNodeId();

    const incomingCondition = createIncomingCondition({
      id: context.generateConnectorId(),
      nodeId: nodeId,
    });

    const outgoingConditionDefault = createOutgoingCondition({
      id: context.generateConnectorId(),
      nodeId: nodeId,
      key: DEFAULT_CONDITION_KEY,
      name: 'DEFAULT',
    });

    const outgoingConditionCustom = createOutgoingCondition({
      id: context.generateConnectorId(),
      nodeId: nodeId,
      name: 'Branch A',
      rule: {
        type: ConditionRuleType.Group,
        operator: GroupOperatorType.AND,
        rules: [
          {
            type: ConditionRuleType.Structured,
            leftHandVariableId: null,
            operator: StructuredConditionOperatorType.CONTAINS,
            rightHandValueType: StructuredConditionRightHandValueType.INLINE,
            rightHandInlineValue: '',
            rightHandVariableId: null,
          },
        ],
      },
    });

    const inputVariable = createInputVariable({
      id: context.generateConnectorId(),
      nodeId: nodeId,
      name: 'input1',
    });

    const nodeConfig = createDefaultConditionsNodeConfig({
      nodeId: nodeId,
      name: context.getAvailableNodeName('Conditions'),
      incomingConditionIds: [incomingCondition.id],
      outgoingConditionIds: [
        outgoingConditionDefault.id,
        outgoingConditionCustom.id,
      ],
      inputVariableIds: [inputVariable.id],
      outputVariableIds: [],
    });

    nodeConfig.fields.inputs.configs[0].variableIds.push(inputVariable.id);

    return {
      nodeConfigs: [nodeConfig],
      connectors: [
        incomingCondition,
        outgoingConditionCustom,
        outgoingConditionDefault,
        inputVariable,
      ],
    };
  },

  async runNode(params) {
    const variableIdToValues = Object.fromEntries(
      params.inputVariables.map((inputVariable, index) => {
        return [inputVariable.id, params.inputVariableValues[index]];
      }),
    );

    const variableNameToValues = params.nodeParams.inputs;

    const stopAtFirstMatch = params.nodeParams.stopAtFirstMatch;

    // NOTE: First condition is the default condition
    const outgoingConditions = params.outgoingConditions.slice(1);

    const conditionResults: ConditionResult[] = [{ matched: false }];

    let hasMatch = false;

    for (const condition of outgoingConditions) {
      if (hasMatch && stopAtFirstMatch) {
        conditionResults.push({ matched: false });
        continue;
      }

      invariant(condition.rule != null, 'Condition rule is missing');

      if (
        await checkGroupConditionRule(
          variableNameToValues,
          variableIdToValues,
          condition.rule,
        )
      ) {
        hasMatch = true;
        conditionResults.push({ matched: true });
      } else {
        conditionResults.push({ matched: false });
      }
    }

    if (!hasMatch) {
      conditionResults[0].matched = true;
    }

    return { conditionResults };
  },
};

async function checkGroupConditionRule(
  variableNameToValues: Record<string, unknown>,
  variableIdToValues: Record<string, unknown>,
  groupRule: GroupConditionRule,
): Promise<boolean> {
  const { operator, rules } = groupRule;

  if (operator === GroupOperatorType.AND) {
    for (const rule of rules) {
      if (
        !(await checkConditionRule(
          variableNameToValues,
          variableIdToValues,
          rule,
        ))
      ) {
        return false;
      }
    }
    return true;
  } else {
    for (const rule of rules) {
      if (
        await checkConditionRule(variableNameToValues, variableIdToValues, rule)
      ) {
        return true;
      }
    }
    return false;
  }
}

async function checkConditionRule(
  variableNameToValues: Record<string, unknown>,
  variableIdToValues: Record<string, unknown>,
  rule: ConditionRule,
): Promise<boolean> {
  switch (rule.type) {
    case ConditionRuleType.Structured: {
      const {
        leftHandVariableId,
        operator,
        rightHandValueType,
        rightHandInlineValue,
        rightHandVariableId,
      } = rule;

      if (leftHandVariableId == null) {
        return false;
      }

      if (
        rightHandValueType ===
          StructuredConditionRightHandValueType.INPUT_VARIABLE &&
        rightHandVariableId == null
      ) {
        return false;
      }

      const leftHandValue = variableIdToValues[leftHandVariableId];
      const rightHandValue = (() => {
        switch (rightHandValueType) {
          case StructuredConditionRightHandValueType.INLINE:
            return rightHandInlineValue;
          case StructuredConditionRightHandValueType.INPUT_VARIABLE:
            return variableIdToValues[rightHandVariableId!];
        }
      })();

      switch (operator) {
        case StructuredConditionOperatorType.EQUALS:
          return leftHandValue === rightHandValue;
        case StructuredConditionOperatorType.NOT_EQUALS:
          return leftHandValue !== rightHandValue;
        case StructuredConditionOperatorType.CONTAINS:
          return (
            typeof leftHandValue === 'string' &&
            typeof rightHandValue === 'string' &&
            leftHandValue.includes(rightHandValue)
          );
        case StructuredConditionOperatorType.NOT_CONTAINS:
          return (
            typeof leftHandValue === 'string' &&
            typeof rightHandValue === 'string' &&
            !leftHandValue.includes(rightHandValue)
          );
      }
    }
    case ConditionRuleType.JSONataExpression: {
      /**
       * NOTE: If anything went wrong here, it throw as an fatal error caught
       * by the runFlow process
       */
      const expression = jsonata(rule.expressionString);
      const result = await expression.evaluate(variableNameToValues);
      return !!result;
    }
    case ConditionRuleType.Group: {
      return await checkGroupConditionRule(
        variableNameToValues,
        variableIdToValues,
        rule,
      );
    }
  }
}
