import { createDraft, finishDraft } from 'immer';
import invariant from 'tiny-invariant';

import {
  LlmMessageContentSource,
  type LlmMessageContentSourceEnum,
  NodeConfigFieldType,
  type NodeConfigInputVariableFieldConfig,
  type NodeConfigLlmMessagesFieldConfig,
  NodeDefinitionConfigSectionKind,
  createInputVariable,
} from 'canvas-data-base';
import { NODE_DEFINITIONS } from 'canvas-data-unified';
import randomId from 'common-utils/randomId';

import { canvasDataAtom } from '../atoms/canvas-data';
import { canvasStore } from '../store';
import { getAvailableVariableName } from '../util/get-available-util';
import { toggleEdgeVisibilityOnInputVariableIdsChange } from './shared-actions/toggle-edge-visibility';
import { updateNodeConfigInputVariableIds } from './shared-actions/update-node-config-connector-ids-field';

type AddInputVariableForFieldConfigParams = {
  nodeId: string;
  fieldKey: string;
  fieldIndex: number;
};

/**
 * This should be used only to add variable to field config that has variableIds
 * properties. In this case inputVariableIds on nodeConfig should not be
 * managed directly.
 */
export function addInputVariableForFieldConfig<
  T extends { variableIds: string[] },
>(params: AddInputVariableForFieldConfigParams) {
  const canvasDataDraft = createDraft(canvasStore.get(canvasDataAtom));

  const variable = createInputVariable({
    id: randomId(),
    nodeId: params.nodeId,
    name: getAvailableVariableName('variable'),
  });

  canvasDataDraft.connectors[variable.id] = variable;

  const nodeConfig = canvasDataDraft.nodeConfigs[params.nodeId];

  const configField = nodeConfig.fields[params.fieldKey];
  const fieldConfig = configField.configs[params.fieldIndex] as T;

  invariant('variableIds' in fieldConfig, 'Field config must have variableIds');

  fieldConfig.variableIds.push(variable.id);

  /**
   * NOTE: Always update the inputVariableIds
   */
  updateNodeConfigInputVariableIds(canvasDataDraft, params.nodeId);

  const canvasData = finishDraft(canvasDataDraft);
  canvasStore.set(canvasDataAtom, canvasData);
}

type DeleteVariableForConfigFieldWithVariableIdsParams = {
  nodeId: string;
  fieldKey: string;
  fieldIndex: number;
  variableId: string;
};

/**
 * This should be used only to add variable to field config that has variableIds
 * properties. In this case inputVariableIds on nodeConfig should not be
 * managed directly.
 */
export function deleteVariableForConfigFieldWithVariableIds<
  T extends { variableIds: string[] },
>(params: DeleteVariableForConfigFieldWithVariableIdsParams) {
  const canvasDataDraft = createDraft(canvasStore.get(canvasDataAtom));

  const nodeConfig = canvasDataDraft.nodeConfigs[params.nodeId];
  const fieldConfig = nodeConfig.fields[params.fieldKey].configs[
    params.fieldIndex
  ] as T;

  invariant(
    'variableIds' in fieldConfig,
    'Field Config should have variableIds',
  );

  const index = fieldConfig.variableIds.findIndex(
    (id) => id === params.variableId,
  );
  fieldConfig.variableIds.splice(index, 1);

  delete canvasDataDraft.connectors[params.variableId];

  const edgeIndex = canvasDataDraft.edges.findIndex(
    (edge) => edge.targetHandle === params.variableId,
  );
  canvasDataDraft.edges.splice(edgeIndex, 1);

  /**
   * NOTE: Always update the inputVariableIds
   */
  updateNodeConfigInputVariableIds(canvasDataDraft, params.nodeId);

  const canvasData = finishDraft(canvasDataDraft);
  canvasStore.set(canvasDataAtom, canvasData);
}

type SwitchConfigFieldActiveConfigParams = {
  nodeId: string;
  fieldConfigSectionIndex: number;
  fieldKey: string;
};

export function switchConfigFieldActiveConfig(
  params: SwitchConfigFieldActiveConfigParams,
) {
  const canvasDataDraft = createDraft(canvasStore.get(canvasDataAtom));

  const nodeConfig = canvasDataDraft.nodeConfigs[params.nodeId];
  const nodeDef = NODE_DEFINITIONS[nodeConfig.type];
  const section = nodeDef.sections[params.fieldConfigSectionIndex];
  const nodeConfigField = nodeConfig.fields[params.fieldKey];

  invariant(
    section.kind === NodeDefinitionConfigSectionKind.Field,
    'Config Section should be a Field Section.',
  );

  const nextFieldConfigIndex =
    (nodeConfigField.index + 1) % section.options.length;
  const nextFieldDef = section.options[nextFieldConfigIndex];

  /**
   * NOTE: Switching to a variable field config
   */
  if (nextFieldDef.type === NodeConfigFieldType.InputVariable) {
    const nextFieldConfig = nodeConfigField.configs[
      nextFieldConfigIndex
    ] as NodeConfigInputVariableFieldConfig;

    invariant(
      'variableId' in nextFieldConfig,
      'Next field config must be an InputVariableFieldConfig',
    );

    /**
     * NOTE: Create new variable if the next field config doesn't have
     *       a variableId
     */
    if (nextFieldConfig.variableId == null) {
      const variable = createInputVariable({
        id: randomId(),
        nodeId: params.nodeId,
        name: nextFieldDef.defaultVariableName ?? params.fieldKey,
      });

      canvasDataDraft.connectors[variable.id] = variable;

      nextFieldConfig.variableId = variable.id;
    }
  }

  /**
   * NOTE: Don't forget to update the index
   */
  nodeConfigField.index = nextFieldConfigIndex;

  /**
   * NOTE: Always update the inputVariableIds
   */
  updateNodeConfigInputVariableIds(canvasDataDraft, params.nodeId);
  toggleEdgeVisibilityOnInputVariableIdsChange(canvasDataDraft, params.nodeId);

  const canvasData = finishDraft(canvasDataDraft);
  canvasStore.set(canvasDataAtom, canvasData);
}

type SwitchLlmMessageConfigContentSourceTypeParams = {
  nodeId: string;
  fieldKey: string;
  fieldIndex: number;
  messageConfigIndex: number;
  contentSourceType: LlmMessageContentSourceEnum;
};

export function switchLlmMessageConfigContentSourceType(
  params: SwitchLlmMessageConfigContentSourceTypeParams,
) {
  const canvasDataDraft = createDraft(canvasStore.get(canvasDataAtom));

  const nodeConfig = canvasDataDraft.nodeConfigs[params.nodeId];
  const fieldConfig = nodeConfig.fields[params.fieldKey].configs[
    params.fieldIndex
  ] as NodeConfigLlmMessagesFieldConfig;
  const messageConfig = fieldConfig.messages[params.messageConfigIndex];

  /**
   * NOTE: Switching from Variable to Inline
   *
   * Just set the contentSourceType to Inline is sufficient
   */
  if (params.contentSourceType === LlmMessageContentSource.Inline) {
    messageConfig.contentSourceType = LlmMessageContentSource.Inline;
  } else {
    /**
     * NOTE: Switching from inline to variable with existing variable
     *
     * Just set the contentSourceType to Variable is sufficient
     */
    if (messageConfig.contentVariableId != null) {
      messageConfig.contentSourceType = LlmMessageContentSource.Variable;
    } else {
      /**
       * NOTE: Switching from inline to variable without existing variable
       *
       * Create a new variable and set the contentVariableId to the new variable
       */
      const variable = createInputVariable({
        id: randomId(),
        nodeId: params.nodeId,
        name: getAvailableVariableName('message content'),
      });

      canvasDataDraft.connectors[variable.id] = variable;

      messageConfig.contentSourceType = LlmMessageContentSource.Variable;
      messageConfig.contentVariableId = variable.id;
    }
  }

  /**
   * NOTE: Always update the inputVariableIds
   *
   * It is affected by the contentSourceType
   */
  updateNodeConfigInputVariableIds(canvasDataDraft, params.nodeId);
  toggleEdgeVisibilityOnInputVariableIdsChange(canvasDataDraft, params.nodeId);

  const canvasData = finishDraft(canvasDataDraft);
  canvasStore.set(canvasDataAtom, canvasData);
}

type DeleteLlmMessageConfigParams = {
  nodeId: string;
  fieldKey: string;
  fieldIndex: number;
  messageConfigIndex: number;
};

export function deleteLlmMessageConfig(params: DeleteLlmMessageConfigParams) {
  const canvasDataDraft = createDraft(canvasStore.get(canvasDataAtom));

  const nodeConfig = canvasDataDraft.nodeConfigs[params.nodeId];
  const fieldConfig = nodeConfig.fields[params.fieldKey].configs[
    params.fieldIndex
  ] as NodeConfigLlmMessagesFieldConfig;
  const messageConfig = fieldConfig.messages[params.messageConfigIndex];

  if (messageConfig.contentVariableId != null) {
    delete canvasDataDraft.connectors[messageConfig.contentVariableId];

    const edgeIndex = canvasDataDraft.edges.findIndex(
      (edge) => edge.targetHandle === messageConfig.contentVariableId,
    );
    canvasDataDraft.edges.splice(edgeIndex, 1);
  }

  fieldConfig.messages.splice(params.messageConfigIndex, 1);

  /**
   * NOTE: Always update the inputVariableIds
   */
  updateNodeConfigInputVariableIds(canvasDataDraft, params.nodeId);

  const canvasData = finishDraft(canvasDataDraft);
  canvasStore.set(canvasDataAtom, canvasData);
}
