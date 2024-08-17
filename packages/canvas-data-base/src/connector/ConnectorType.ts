export const ConnectorType = {
  InputVariable: 'InputVariable',
  OutputVariable: 'OutputVariable',
  IncomingCondition: 'IncomingCondition',
  OutgoingCondition: 'OutgoingCondition',
} as const;

export type ConnectorTypeEnum =
  (typeof ConnectorType)[keyof typeof ConnectorType];
