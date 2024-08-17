import { ConnectorType } from './ConnectorType';
import {
  type IncomingCondition,
  IncomingConditionSchema,
  type InputVariable,
  InputVariableSchema,
  type OutgoingCondition,
  type OutputVariable,
  OutputVariableSchema,
} from './connector-schema-and-types';
import { OutgoingConditionSchema } from './outgoing-condition-schema';

export function createInputVariable(
  params: Partial<InputVariable> &
    Pick<InputVariable, 'id' | 'nodeId' | 'name'>,
): InputVariable {
  return InputVariableSchema.parse({
    type: ConnectorType.InputVariable,
    isReference: false,
    referencedVariableId: null,
    ...params,
  });
}

export function createOutputVariable(
  params: Partial<OutputVariable> &
    Pick<OutputVariable, 'id' | 'nodeId' | 'name'>,
): OutputVariable {
  return OutputVariableSchema.parse({
    type: ConnectorType.OutputVariable,
    isReference: false,
    referencedVariableId: null,
    ...params,
  });
}

export function createIncomingCondition(
  params: Partial<IncomingCondition> & Pick<IncomingCondition, 'id' | 'nodeId'>,
): IncomingCondition {
  return IncomingConditionSchema.parse({
    type: ConnectorType.IncomingCondition,
    ...params,
  });
}

export function createOutgoingCondition(
  params: Partial<OutgoingCondition> & Pick<OutgoingCondition, 'id' | 'nodeId'>,
): OutgoingCondition {
  return OutgoingConditionSchema.parse({
    type: ConnectorType.OutgoingCondition,
    ...params,
  });
}
