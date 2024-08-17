import {
  ConnectorType,
  type InputVariable,
  type OutputVariable,
} from 'canvas-data-base';

import {
  canvasConnectorsAtom,
  canvasNodeConfigsAtom,
} from '../atoms/canvas-data';
import { workflowsAtom } from '../atoms/workflows';
import { canvasStore } from '../store';

export function getAvailableNodeName(prefix: string): string {
  const nodeConfigs = canvasStore.get(canvasNodeConfigsAtom);
  const nodeConfigNames = Object.values(nodeConfigs).map(
    (nodeConfig) => nodeConfig.name,
  );
  const nodeConfigNameSet = new Set(nodeConfigNames);

  let index = 1;
  let nodeName = `${prefix} ${index}`;

  while (nodeConfigNameSet.has(nodeName)) {
    index++;
    nodeName = `${prefix} ${index}`;
  }

  return nodeName;
}

export function getAvailableVariableName(prefix: string): string {
  const connectors = canvasStore.get(canvasConnectorsAtom);
  const variableNames = Object.values(connectors)
    .filter((connector): connector is InputVariable | OutputVariable => {
      return (
        connector.type === ConnectorType.InputVariable ||
        connector.type === ConnectorType.OutputVariable
      );
    })
    .map((connector) => connector.name);
  const variableNameSet = new Set(variableNames);

  let index = 1;
  let variableName = `${prefix} ${index}`;

  while (variableNameSet.has(variableName)) {
    index++;
    variableName = `${prefix} ${index}`;
  }

  return variableName;
}

export function getAvailableWorkflowName(prefix: string): string {
  const workflows = canvasStore.get(workflowsAtom);

  const workflowNames = workflows.map((workflow) => workflow.name);
  const workflowNameSet = new Set(workflowNames);

  let index = 1;
  let workflowName = `${prefix} ${index}`;

  while (workflowNameSet.has(workflowName)) {
    index++;
    workflowName = `${prefix} ${index}`;
  }

  return workflowName;
}
