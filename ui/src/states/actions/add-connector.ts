import { produce } from 'immer';

import {
  ConditionRuleType,
  GroupOperatorType,
  NodeDefinitionConfigSectionUIType,
  StructuredConditionOperatorType,
  StructuredConditionRightHandValueType,
  createInputVariable,
  createOutgoingCondition,
  createOutputVariable,
} from 'canvas-data-base';
import randomId from 'common-utils/randomId';

import {
  canvasConnectorsAtom,
  canvasNodeConfigsAtom,
} from '../atoms/canvas-data';
import { canvasStore } from '../store';
import { getAvailableVariableName } from '../util/get-available-util';

type AddConnectorParams = {
  nodeId: string;
  sectionType:
    | NodeDefinitionConfigSectionUIType.StartNodeVariables
    | NodeDefinitionConfigSectionUIType.FinishNodeVariables
    | NodeDefinitionConfigSectionUIType.InputVariables;
};

/**
 * This should be used only by Input and Output nodes, which manages
 * inputVariableIds and outputVariableIds directly.
 */
export function addConnectorForUiConfigSection(params: AddConnectorParams) {
  const connector = (() => {
    switch (params.sectionType) {
      case NodeDefinitionConfigSectionUIType.InputVariables:
        return createInputVariable({
          id: randomId(),
          nodeId: params.nodeId,
          name: getAvailableVariableName('input'),
        });
      case NodeDefinitionConfigSectionUIType.FinishNodeVariables:
        return createInputVariable({
          id: randomId(),
          nodeId: params.nodeId,
          name: getAvailableVariableName('output result'),
        });
      case NodeDefinitionConfigSectionUIType.StartNodeVariables:
        return createOutputVariable({
          id: randomId(),
          nodeId: params.nodeId,
          name: getAvailableVariableName('input argument'),
        });
    }
  })();

  canvasStore.set(canvasConnectorsAtom, (prev) =>
    produce(prev, (draft) => {
      draft[connector.id] = connector;
    }),
  );

  canvasStore.set(canvasNodeConfigsAtom, (prev) =>
    produce(prev, (draft) => {
      switch (params.sectionType) {
        case NodeDefinitionConfigSectionUIType.InputVariables:
        case NodeDefinitionConfigSectionUIType.FinishNodeVariables:
          draft[params.nodeId].inputVariableIds.push(connector.id);
          break;
        case NodeDefinitionConfigSectionUIType.StartNodeVariables:
          draft[params.nodeId].outputVariableIds.push(connector.id);
          break;
      }
    }),
  );

  return connector;
}

type AddOutgoingConditionForUiConfigSectionParams = {
  nodeId: string;
};

export function addOutgoingConditionForUiConfigSection(
  params: AddOutgoingConditionForUiConfigSectionParams,
) {
  const condition = createOutgoingCondition({
    id: randomId(),
    nodeId: params.nodeId,
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

  canvasStore.set(canvasConnectorsAtom, (prev) =>
    produce(prev, (draft) => {
      draft[condition.id] = condition;
    }),
  );

  canvasStore.set(canvasNodeConfigsAtom, (prev) =>
    produce(prev, (draft) => {
      draft[params.nodeId].outgoingConditionIds.push(condition.id);
    }),
  );
}
