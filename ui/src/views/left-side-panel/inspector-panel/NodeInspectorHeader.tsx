import { css } from '@emotion/react';

import { NODE_DEFINITIONS, type NodeConfig } from 'canvas-data-unified';

import { NODE_KIND_COLORS } from '../../../constants/node-kind-colors';

type Props = {
  nodeConfig: NodeConfig;
};

function NodeInspectorHeader(props: Props) {
  const nodeDef = NODE_DEFINITIONS[props.nodeConfig.type];

  return (
    <div>
      <div
        css={css`
          padding: 0 10px;
          display: flex;
          margin-bottom: 5px;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <h1
          css={css`
            font-size: 18px;
          `}
        >
          {props.nodeConfig.name}
        </h1>
        <div>{/* Placeholder */}</div>
      </div>
      <div
        css={css`
          padding: 0 10px;
          background-color: ${NODE_KIND_COLORS[nodeDef.kind]};
          color: white;
          font-weight: bold;
          font-size: 12px;
          line-height: 22px;
        `}
      >
        {nodeDef.label} Node
      </div>
    </div>
  );
}

export default NodeInspectorHeader;
