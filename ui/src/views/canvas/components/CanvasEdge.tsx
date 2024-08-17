import { css } from '@emotion/react';
import { useAtomValue } from 'jotai';
import { type ComponentProps } from 'react';
import {
  BaseEdge,
  BezierEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useEdges,
} from 'reactflow';

import IconTrash from '../../../icons/IconTrash';
import { removeEdge } from '../../../states/actions/remove-edge';
import { canvasUiMouseoverEdgeIdAtom } from '../../../states/atoms/canvas-ui';

function CanvasEdge(props: ComponentProps<typeof BezierEdge>) {
  const mouseoverEdgeId = useAtomValue(canvasUiMouseoverEdgeIdAtom);
  const edges = useEdges();

  const [edgePath, labelX, labelY] = getBezierPath(props);

  const edge = edges.find((edge) => edge.id === props.id)!;

  return (
    <>
      <BaseEdge {...props} path={edgePath} />
      {mouseoverEdgeId === edge.id && (
        <EdgeLabelRenderer>
          <div
            css={css`
              position: absolute;
              transform: translate(-50%, -50%)
                translate(${labelX}px, ${labelY}px);
              padding: 4px;
              border-radius: 5px;
              cursor: pointer;

              // NOTE: Override reactflow, make button interactable.
              pointer-events: all;

              background: ${edge.type === 'variable'
                ? 'var(--canvas-handle-variable-color-light)'
                : 'var(--canvas-handle-condition-color-light)'};

              &:hover {
                background: ${edge.type === 'variable'
                  ? 'var(--canvas-handle-variable-color-heavy)'
                  : 'var(--canvas-handle-condition-color-heavy)'};
              }
            `}
            onClick={() => {
              removeEdge(edge.id);
            }}
          >
            <IconTrash
              css={css`
                width: 14px;
                height: 14px;
                fill: white;
              `}
            />
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default CanvasEdge;
