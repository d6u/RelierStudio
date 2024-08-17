import { css } from '@emotion/react';

import { type NodeConfig } from 'canvas-data-unified';

import { DRAG_HANDLE_CLASS_NAME } from '../../../constants/canvas-constants';
import IconThreeDots from '../../../icons/IconThreeDots';
import CanvasNodeHeaderBanner from './CanvasNodeHeaderBanner';

type Props = {
  nodeConfig: NodeConfig;
};

function CanvasNodeHeader(props: Props) {
  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <IconThreeDots
        css={css`
          position: absolute;
          width: 20px;
          left: calc(50% - 30px / 2);
          top: -3px;
          fill: #cacaca;
          cursor: grab;
        `}
      />
      <div
        className={DRAG_HANDLE_CLASS_NAME}
        css={css`
          cursor: grab;
          padding-top: 10px;
          padding-left: 10px;
          padding-right: 10px;
        `}
      >
        <h3
          css={css`
            margin: 0;
            font-size: 16px;
            line-height: 32px;
            cursor: text;
            width: fit-content;
            max-width: 100%;
            padding-right: 32px;
            overflow: hidden;
            text-wrap: nowrap;
            text-overflow: ellipsis;
          `}
          onDoubleClick={() => {
            // setCanvasRenameNodeId(props.nodeId);
          }}
        >
          {props.nodeConfig.name}
        </h3>
      </div>
      <CanvasNodeHeaderBanner nodeConfig={props.nodeConfig} />
    </div>
  );
}

export default CanvasNodeHeader;
