import { css } from '@emotion/react';
import { Button } from '@mui/joy';
import { useCallback } from 'react';
import { useReactFlow, useStoreApi } from 'reactflow';

import { NODE_DEFINITIONS, NodeType } from 'canvas-data-unified';

import { addNodeToCenterOfCanvas } from '../../../../states/actions/node-and-nodeconfig';
import NodeTag from './NodeTag';

type Props = {
  nodeType: NodeType;
};

function AddNodeCard(props: Props) {
  const nodeDef = NODE_DEFINITIONS[props.nodeType];

  const reactFlow = useReactFlow();
  const reactFlowStoreApi = useStoreApi();

  const addNode = useCallback(() => {
    addNodeToCenterOfCanvas(props.nodeType, reactFlow, reactFlowStoreApi);
  }, [props.nodeType, reactFlow, reactFlowStoreApi]);

  return (
    <div
      css={css`
        background-color: white;
        border-radius: 5px;
        border: 1px solid #e0e0e0;
      `}
    >
      <div
        css={css`
          padding: 0;
          margin: 10px;
        `}
      >
        <h3
          css={css`
            margin-bottom: 5px;
            font-family: var(--font-family-mono);
            font-size: 12px;
            font-weight: bold;
          `}
        >
          {nodeDef.label}
        </h3>
        <div
          css={css`
            display: flex;
            gap: 5px;
          `}
        >
          <NodeTag label={nodeDef.kind} />
        </div>
      </div>
      <div
        css={css`
          padding: 0;
          margin: 10px;
          display: flex;
          justify-content: flex-end;
        `}
      >
        <Button variant="outlined" onClick={addNode}>
          Add
        </Button>
      </div>
    </div>
  );
}

export default AddNodeCard;
