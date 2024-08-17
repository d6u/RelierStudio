import { type Edge } from 'reactflow';
import invariant from 'tiny-invariant';

import { NodeKind } from 'canvas-data-base';
import type { CanvasDataV1 } from 'canvas-data-unified';

export const ROOT_GRAPH_ID = 'ROOT';

type IncomingConnectors = Record<string, SourceConnectors>;
type SourceConnectors = Record<string, boolean>;
export type GraphRecords = Record<string, Graph>;
export type Graph = Record<string, IncomingConnectors>;

export enum NodeGraphErrorType {
  Circle = 'Circle',
  /**
   * A node is directly or indirectly connected with multiple SubroutineStart
   * nodes or between at least one SubroutineStart node and one Start node.
   */
  OverlapSubroutine = 'OverlapSubroutine',
  /**
   * A node is not connected with any SubroutineStart or Start node,
   * but directly or indirectly connected with LoopFinish node.
   */
  NoStartOrSubroutineStart = 'NoStartOrSubroutineStart',
}

type ComputeGraphsParams = {
  canvasData: CanvasDataV1;
  startNodeIds: string[];
};

export function computeGraphs(
  params: ComputeGraphsParams,
): ComputeGraphsReturn {
  const { edges, nodeConfigs } = params.canvasData;
  const { startNodeIds } = params;

  // NOTE: Add a new graph for each SubroutineStart node

  const graphIds: string[] = [];

  Object.values(nodeConfigs).forEach((nodeConfig) => {
    if (nodeConfig.kind === NodeKind.SubroutineStart) {
      graphIds.push(nodeConfig.nodeId);
    }
  });

  // NOTE: Find all root graph start nodes

  const indegrees: Record<string, number> = {};

  Object.values(nodeConfigs).forEach((nodeConfig) => {
    if (
      nodeConfig.kind === NodeKind.Start &&
      startNodeIds.includes(nodeConfig.nodeId)
    ) {
      // NOTE: Start nodes that also in `startNodeIds`
      indegrees[nodeConfig.nodeId] = 0;
    } else if (nodeConfig.kind === NodeKind.Start) {
      // NOTE: Start nodes (that're not in `startNodeIds`),
      indegrees[nodeConfig.nodeId] = 1;
    } else {
      indegrees[nodeConfig.nodeId] = 0;
    }
  });

  for (const { target } of edges) {
    indegrees[target] += 1;
  }

  const rootGraphStartNodeIds: string[] = [];

  Object.keys(indegrees).forEach((nodeId) => {
    if (indegrees[nodeId] === 0 && !graphIds.includes(nodeId)) {
      rootGraphStartNodeIds.push(nodeId);
    }
  });

  if (rootGraphStartNodeIds.length === 0) {
    // NOTE: We have circles in the graph
    return {
      graphRecords: {},
      errors: {
        [ROOT_GRAPH_ID]: [NodeGraphErrorType.Circle],
      },
    };
  }

  const graphRecords: GraphRecords = { [ROOT_GRAPH_ID]: {} };
  const errors: Record<string, NodeGraphErrorType[]> = {};
  const otherGraphTraversedNodeIds: string[] = [];

  // NOTE: Root graph might have multiple starting nodes
  for (const nodeId of rootGraphStartNodeIds) {
    computeGraph({
      edges,
      nodeId,
      otherGraphTraversedNodeIds: [],
      ancestors: [],
      errors,
      graph: graphRecords[ROOT_GRAPH_ID],
    });
  }

  otherGraphTraversedNodeIds.push(...Object.keys(graphRecords[ROOT_GRAPH_ID]));

  for (const nodeId of graphIds) {
    graphRecords[nodeId] = {};
    computeGraph({
      edges,
      nodeId,
      otherGraphTraversedNodeIds,
      ancestors: [],
      errors,
      graph: graphRecords[nodeId],
    });
    otherGraphTraversedNodeIds.push(...Object.keys(graphRecords[nodeId]));
  }

  return { graphRecords, errors };
}

type ComputeGraphsReturn = {
  graphRecords: GraphRecords;
  errors: Record<string, NodeGraphErrorType[]>;
};

type ComputeGraphParam = {
  // start input
  edges: Edge[];
  otherGraphTraversedNodeIds: string[];
  // input for current node
  nodeId: string;
  ancestors: string[];
  // output
  errors: Record<string, NodeGraphErrorType[]>;
  graph: Graph;
};

function computeGraph({
  // start input
  edges,
  otherGraphTraversedNodeIds,
  // input for current node
  nodeId,
  ancestors,
  // output
  errors,
  graph,
}: ComputeGraphParam) {
  if (ancestors.includes(nodeId)) {
    errors[nodeId] = errors[nodeId] ?? [];
    errors[nodeId].push(NodeGraphErrorType.Circle);
    return;
  }

  if (otherGraphTraversedNodeIds.includes(nodeId)) {
    errors[nodeId] = errors[nodeId] ?? [];
    errors[nodeId].push(NodeGraphErrorType.Overlap);
  }

  graph[nodeId] = graph[nodeId] ?? {};

  for (const { target, targetHandle, sourceHandle } of edges) {
    invariant(targetHandle, 'targetHandle is required');
    invariant(sourceHandle, 'sourceHandle is required');

    if (target === nodeId) {
      graph[nodeId][targetHandle] = graph[nodeId][targetHandle] ?? {};
      graph[nodeId][targetHandle][sourceHandle] = false;
    }
  }

  for (const { source, target } of edges) {
    if (source === nodeId) {
      computeGraph({
        edges,
        otherGraphTraversedNodeIds,
        nodeId: target,
        ancestors: [...ancestors, nodeId],
        errors,
        graph,
      });
    }
  }

  return graph;
}
