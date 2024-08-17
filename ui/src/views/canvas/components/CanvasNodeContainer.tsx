import { css } from '@emotion/react';
import { IconButton } from '@mui/joy';
import { useAtomValue } from 'jotai';
import type { ReactNode } from 'react';

import { NodeRunState } from 'run-flow';

import { CANVAS_NODE_CONTENT_WRAPPER_CLASS_NAME } from '../../../constants/canvas-constants';
import IconTrash from '../../../icons/IconTrash';
import { removeNode } from '../../../states/actions/remove-node';
import {
  canvasRunDataRecordsAtom,
  canvasSelectedRunDataIdAtom,
} from '../../../states/atoms/canvas-run-data';
import { canvasUiMouseoverNodeIdAtom } from '../../../states/atoms/canvas-ui';

type Props = {
  nodeId: string;
  selected: boolean;
  dragging: boolean;
  children: ReactNode;
};

function CanvasNodeContainer(props: Props) {
  const mouseoverNodeId = useAtomValue(canvasUiMouseoverNodeIdAtom);
  const runDataRecords = useAtomValue(canvasRunDataRecordsAtom);
  const selectedRunDataId = useAtomValue(canvasSelectedRunDataIdAtom);

  const runData =
    selectedRunDataId == null ? null : runDataRecords[selectedRunDataId];
  const runFlowStates = runData?.runFlowStates;

  return (
    <div
      css={css`
        width: 250px;
        position: relative;
        border-radius: 6px;
      `}
    >
      <div
        css={css`
          position: absolute;
          background: orange;
          height: 30px;
          width: 100%;
          top: -10px;
          z-index: -1;
          border-radius: 6px;
          ${(() => {
            if (
              runFlowStates == null ||
              runFlowStates.nodeStates[props.nodeId] == null
            ) {
              return css`
                display: none;
              `;
            }

            switch (runFlowStates.nodeStates[props.nodeId]) {
              case NodeRunState.PENDING:
                return css`
                  display: none;
                `;
              case NodeRunState.SKIPPED:
                return css`
                  background: grey;
                `;
              case NodeRunState.RUNNING:
                return css`
                  background-size: 300px 300px;
                  background-image: linear-gradient(
                    90deg,
                    #4158d0 0%,
                    #c850c0 46%,
                    #ffcc70 100%
                  );
                  animation: NodeRunStateRunningBGAnimation 2s linear infinite;
                  @keyframes NodeRunStateRunningBGAnimation {
                    0% {
                      background-position: 0% 0%;
                    }
                    100% {
                      background-position: 300px 0%;
                    }
                  }
                `;
              case NodeRunState.INTERRUPTED:
                return css`
                  background: pink;
                `;
              case NodeRunState.FAILED:
                return css`
                  background: red;
                `;
              case NodeRunState.SUCCEEDED:
                return css`
                  background: lightgreen;
                `;
            }
          })()}
        `}
      />
      <div
        className={CANVAS_NODE_CONTENT_WRAPPER_CLASS_NAME}
        css={[
          // Outter box's background acts as the border.
          css`
            padding: 2px;
            border-radius: 6px;
            cursor: initial;
            ${(() => {
              if (props.selected) {
                return css`
                  background: var(--node-selected-background);
                `;
              } else {
                return css`
                  background: linear-gradient(344deg, #dbdbdb 0%, #c9c9c9 100%);
                `;
              }
            })()}
          `,
        ]}
      >
        <div
          css={css`
            background: #fff;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding-bottom: 10px;
          `}
        >
          {props.children}
        </div>
      </div>
      {mouseoverNodeId === props.nodeId && !props.dragging && (
        <div
          css={css`
            position: absolute;
            background: white;
            width: 100%;
            bottom: -44px;
            padding-top: 15px;
            padding-left: 5px;
            padding-right: 5px;
            padding-bottom: 5px;
            z-index: -1;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
          `}
        >
          <IconButton
            onClickCapture={(event) => {
              // NOTE: Prevent removing the current selection on the other node.
              event.preventDefault();

              removeNode(props.nodeId);
            }}
          >
            <IconTrash
              css={css`
                width: 16px;
                height: 16px;
              `}
            />
          </IconButton>
        </div>
      )}
    </div>
  );
}

export default CanvasNodeContainer;
