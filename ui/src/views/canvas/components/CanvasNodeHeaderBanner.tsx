import { css } from '@emotion/react';
import { useAtomValue } from 'jotai';
import { Position } from 'reactflow';

import { NodeKind } from 'canvas-data-base';
import { NODE_DEFINITIONS, type NodeConfig } from 'canvas-data-unified';

import { HANDLE_RADIUS } from '../../../constants/canvas-constants';
import { NODE_KIND_COLORS } from '../../../constants/node-kind-colors';
import { canvasEdgesAtom } from '../../../states/atoms/canvas-data';
import { ConditionHandle } from './canvas-node-handles';

const HANDLE_BANNER_PADDING = 4;
const BANNER_LEFT = HANDLE_RADIUS + HANDLE_BANNER_PADDING + 1;

type Props = {
  nodeConfig: NodeConfig;
};

function CanvasNodeHeaderBanner(props: Props) {
  const edges = useAtomValue(canvasEdgesAtom);

  const nodeDef = NODE_DEFINITIONS[props.nodeConfig.type];

  const hasIncomingCondition =
    nodeDef.kind !== NodeKind.Start &&
    nodeDef.kind !== NodeKind.SubroutineStart;

  const hasOutgoingCondition = nodeDef.kind !== NodeKind.Finish;

  const hasMultipleIncomingConditions =
    props.nodeConfig.incomingConditionIds.length > 1;

  const hasMultipleOutgoingConditions =
    props.nodeConfig.outgoingConditionIds.length > 1;

  const incomingConditionId = hasIncomingCondition
    ? props.nodeConfig.incomingConditionIds[0]
    : null;

  const outgoingConditionId = hasOutgoingCondition
    ? props.nodeConfig.outgoingConditionIds[0]
    : null;

  return (
    <div
      // className={DRAG_HANDLE_CLASS_NAME}
      css={css`
        position: relative;
        width: calc(100% + ${BANNER_LEFT * 2}px);
        height: ${(HANDLE_RADIUS + HANDLE_BANNER_PADDING) * 2}px;
        left: -${BANNER_LEFT}px;
        display: flex;
        align-items: center;
        border-radius: 4px;
        background: ${NODE_KIND_COLORS[nodeDef.kind]};
      `}
    >
      {hasIncomingCondition && !hasMultipleIncomingConditions && (
        <ConditionHandle
          css={css`
            left: ${HANDLE_BANNER_PADDING}px;
          `}
          id={incomingConditionId!}
          type="target"
          position={Position.Left}
          connected={edges.some(
            (edge) => edge.targetHandle === incomingConditionId,
          )}
        />
      )}
      <h3
        css={css`
          margin: 0;
          height: 24px;
          font-size: 12px;
          line-height: 24px;
          color: white;
          padding: 0 ${(HANDLE_RADIUS + HANDLE_BANNER_PADDING) * 2}px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        `}
      >
        {nodeDef.label} Node
      </h3>
      {hasOutgoingCondition && !hasMultipleOutgoingConditions && (
        <ConditionHandle
          css={css`
            right: ${HANDLE_BANNER_PADDING}px;
          `}
          id={outgoingConditionId!}
          type="source"
          position={Position.Right}
          connected={edges.some(
            (edge) => edge.sourceHandle === outgoingConditionId,
          )}
        />
      )}
    </div>
  );
}

export default CanvasNodeHeaderBanner;
