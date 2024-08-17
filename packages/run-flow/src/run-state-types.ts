export const NodeRunState = {
  PENDING: 'PENDING',
  SKIPPED: 'SKIPPED',
  RUNNING: 'RUNNING',
  INTERRUPTED: 'INTERRUPTED',
  FAILED: 'FAILED',
  SUCCEEDED: 'SUCCEEDED',
} as const;

export type NodeRunStateEnum = (typeof NodeRunState)[keyof typeof NodeRunState];

export const ConnectorRunState = {
  UNCONNECTED: 'UNCONNECTED',
  PENDING: 'PENDING',
  SKIPPED: 'SKIPPED',
  UNMET: 'UNMET',
  MET: 'MET',
} as const;

export type ConnectorRunStateEnum =
  (typeof ConnectorRunState)[keyof typeof ConnectorRunState];

export const EdgeRunState = {
  PENDING: 'PENDING',
  SKIPPED: 'SKIPPED',
  UNMET: 'UNMET',
  MET: 'MET',
} as const;

export type EdgeRunStateEnum = (typeof EdgeRunState)[keyof typeof EdgeRunState];

// Object type

export type RunFlowStates = {
  nodeStates: Record<string, NodeRunStateEnum>;
  connectorStates: Record<string, ConnectorRunStateEnum>;
  edgeStates: Record<string, EdgeRunStateEnum>;
};
