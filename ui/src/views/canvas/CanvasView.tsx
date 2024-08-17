import { css } from '@emotion/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useAtomDevtools } from 'jotai-devtools';
import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  type Node,
  ReactFlow,
} from 'reactflow';

import { addNewCanvasHistory } from '../../states/actions/canvas-history';
import {
  reactFlowOnConnect,
  reactFlowOnEdgesChange,
  reactFlowOnNodesChange,
} from '../../states/actions/reactflow-actions';
import { initializeCanvasConfigKeyEffect } from '../../states/atoms/canvas-config';
import {
  canvasDataAtom,
  canvasEdgesAtom,
  canvasNodesAtom,
} from '../../states/atoms/canvas-data';
import {
  LeftSidePanelType,
  canvasLeftSidePanelTypeAtom,
} from '../../states/atoms/canvas-left-side-panel';
import { canvasReadonlyAtom } from '../../states/atoms/canvas-meta-data';
import { canvasRunDataRecordsAtom } from '../../states/atoms/canvas-run-data';
import {
  canvasUiMouseoverEdgeIdAtom,
  canvasUiMouseoverNodeIdAtom,
} from '../../states/atoms/canvas-ui';
import CanvasEdge from './components/CanvasEdge';
import CanvasNode from './components/CanvasNode';
import './reactflow-customize.css';

const NODE_TYPES = {
  default: CanvasNode,
};

const EDGE_TYPE = {
  condition: CanvasEdge,
  variable: CanvasEdge,
};

function CanvasView() {
  useAtomDevtools(canvasDataAtom);
  useAtomDevtools(canvasRunDataRecordsAtom);

  useAtom(initializeCanvasConfigKeyEffect);

  const readonly = useAtomValue(canvasReadonlyAtom);
  const edges = useAtomValue(canvasEdgesAtom);
  const nodes = useAtomValue(canvasNodesAtom);

  const setLeftSidePanelType = useSetAtom(canvasLeftSidePanelTypeAtom);
  const setMouseoverEdgeId = useSetAtom(canvasUiMouseoverEdgeIdAtom);
  const setMouseoverNodeId = useSetAtom(canvasUiMouseoverNodeIdAtom);

  return (
    <div
      css={css`
        grid-area: canvas;
      `}
    >
      <ReactFlow
        // ref={setNodeRef}
        zoomOnScroll
        minZoom={0.1}
        maxZoom={1}
        // Prevent select to trigger position change
        nodeDragThreshold={1}
        nodesConnectable={!readonly}
        elementsSelectable={!readonly}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPE}
        nodeOrigin={[0.5, 0]}
        edges={edges as Edge[]}
        nodes={nodes as Node[]}
        onInit={(reactflow) => {
          reactflow.fitView();
        }}
        onNodeClick={() => {
          /**
           * NOTE: This is to handled the case when a node is selected, then
           * switch to another panel, then clicking the same node again should
           * switch to inspector panel again.
           */
          setLeftSidePanelType(LeftSidePanelType.Inspector);
        }}
        onNodeDragStart={() => {
          // TODO: This won't be triggered when dragging multiple nodes
          addNewCanvasHistory();
        }}
        onNodesChange={(changes) => {
          reactFlowOnNodesChange(changes);
        }}
        onEdgesChange={(changes) => {
          reactFlowOnEdgesChange(changes);
        }}
        onConnect={(connection) => {
          reactFlowOnConnect(connection);
        }}
        // NOTE: For displaying edge buttons
        onEdgeMouseEnter={(_event, edge) => {
          setMouseoverEdgeId(edge.id);
        }}
        onEdgeMouseLeave={() => {
          setMouseoverEdgeId(null);
        }}
        onNodeMouseEnter={(_event, node) => {
          setMouseoverNodeId(node.id);
        }}
        onNodeMouseLeave={() => {
          setMouseoverNodeId(null);
        }}
        // onConnectStart={(event, params) => {
        //   // onEdgeConnectStart(params);
        // }}
        // onConnectEnd={() => {
        //   // onEdgeConnectStop();
        // }}
        // NOTE: We are not using isValidConnection to prevent invalid connection
        // because it get called too frequent
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default CanvasView;
