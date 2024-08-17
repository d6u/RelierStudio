import { createDraft, finishDraft } from 'immer';

import { ConnectorType } from 'canvas-data-base';

import { canvasDataAtom } from '../atoms/canvas-data';
import { canvasStore } from '../store';
import { removeConnectors } from './shared-actions/remove-connectors';

type DeleteConnectorParams = {
  nodeId: string;
  connectorId: string;
};

export function removeConnectorOnNode(params: DeleteConnectorParams) {
  const canvasDataDraft = createDraft(canvasStore.get(canvasDataAtom));

  const connector = canvasDataDraft.connectors[params.connectorId];
  const nodeConfig = canvasDataDraft.nodeConfigs[params.nodeId];

  switch (connector.type) {
    case ConnectorType.InputVariable: {
      const inputIndex = nodeConfig.inputVariableIds.findIndex(
        (variableId) => variableId === params.connectorId,
      );
      nodeConfig.inputVariableIds.splice(inputIndex, 1);
      break;
    }
    case ConnectorType.OutputVariable: {
      const outputIndex = nodeConfig.outputVariableIds.findIndex(
        (variableId) => variableId === params.connectorId,
      );
      nodeConfig.outputVariableIds.splice(outputIndex, 1);
      break;
    }
    case ConnectorType.IncomingCondition: {
      const incomingIndex = nodeConfig.incomingConditionIds.findIndex(
        (conditionId) => conditionId === params.connectorId,
      );
      nodeConfig.incomingConditionIds.splice(incomingIndex, 1);
      break;
    }
    case ConnectorType.OutgoingCondition: {
      const outgoingIndex = nodeConfig.outgoingConditionIds.findIndex(
        (conditionId) => conditionId === params.connectorId,
      );
      nodeConfig.outgoingConditionIds.splice(outgoingIndex, 1);
      break;
    }
  }

  removeConnectors(canvasDataDraft, [params.connectorId]);

  const canvasData = finishDraft(canvasDataDraft);
  canvasStore.set(canvasDataAtom, canvasData);
}
