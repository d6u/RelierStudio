import { NodeKind } from 'canvas-data-base';

export const NODE_KIND_COLORS = {
  [NodeKind.Start]: '#4caf50',
  [NodeKind.Finish]: '#f44336',
  [NodeKind.Process]: '#2196f3',
  [NodeKind.Condition]: '#ff9800',
  [NodeKind.Subroutine]: '#9c27b0',
  [NodeKind.SubroutineStart]: '#673ab7',
};
