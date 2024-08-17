import {
  type IncomingCondition,
  type InputVariable,
  type OutgoingCondition,
  type OutputVariable,
} from 'canvas-data-base';
import { type NodeConfig } from 'canvas-data-unified';

import { type ConnectorRecords } from './run-flow-types';

export function getIncomingConnectorsForNode(
  connectors: ConnectorRecords,
  nodeConfig: NodeConfig,
): (InputVariable | IncomingCondition)[] {
  return (
    nodeConfig.inputVariableIds.map(
      (variableId) => connectors[variableId] as InputVariable,
    ) as (InputVariable | IncomingCondition)[]
  ).concat(
    nodeConfig.incomingConditionIds.map(
      (conditionId) => connectors[conditionId] as IncomingCondition,
    ),
  );
}

export function getIncomingConditionsForNode(
  connectors: ConnectorRecords,
  nodeConfig: NodeConfig,
): IncomingCondition[] {
  return nodeConfig.incomingConditionIds.map(
    (conditionId) => connectors[conditionId] as IncomingCondition,
  );
}

export function getOutgoingConditionsForNode(
  connectors: ConnectorRecords,
  nodeConfig: NodeConfig,
): OutgoingCondition[] {
  return nodeConfig.outgoingConditionIds.map(
    (conditionId) => connectors[conditionId] as OutgoingCondition,
  );
}

export function getOutputVariablesForNode(
  connectors: ConnectorRecords,
  nodeConfig: NodeConfig,
): OutputVariable[] {
  return nodeConfig.outputVariableIds.map(
    (variableId) => connectors[variableId] as OutputVariable,
  );
}

export function getInputVariablesForNode(
  connectors: ConnectorRecords,
  nodeConfig: NodeConfig,
): InputVariable[] {
  return nodeConfig.inputVariableIds.map(
    (variableId) => connectors[variableId] as InputVariable,
  );
}
