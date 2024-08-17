export const NodeKind = {
  Start: 'Start',
  Finish: 'Finish',
  Process: 'Process',
  Condition: 'Condition',
  Subroutine: 'Subroutine',
  SubroutineStart: 'SubroutineStart',
} as const;

export type NodeKindEnum = (typeof NodeKind)[keyof typeof NodeKind];
