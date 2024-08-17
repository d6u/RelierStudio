import { difference, partition } from 'fp-ts/Array';
import { eqStrict } from 'fp-ts/Eq';
import { createDraft, finishDraft } from 'immer';
import {
  type Connection,
  type Edge,
  type EdgeChange,
  type EdgeRemoveChange,
  type Node,
  type NodeChange,
  type NodeDimensionChange,
  type NodePositionChange,
  type NodeRemoveChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import invariant from 'tiny-invariant';

import { ConnectorType, type EdgePersistPartial } from 'canvas-data-base';
import randomId from 'common-utils/randomId';

import {
  canvasConnectorsAtom,
  canvasDataAtom,
  canvasEdgesAtom,
} from '../atoms/canvas-data';
import {
  LeftSidePanelType,
  canvasInspectorSelectedNodeIdAtom,
  canvasLeftSidePanelTypeAtom,
} from '../atoms/canvas-left-side-panel';
import { canvasStore } from '../store';
import { removeEdges } from './shared-actions/remove-edges';
import { removeNodeConfigs } from './shared-actions/remove-node-configs';

export function reactFlowOnNodesChange(changes: NodeChange[]): void {
  const canvasDataDraft = createDraft(canvasStore.get(canvasDataAtom));

  /**
   * NOTE: It seems we can safely assume all changes are of the same type.
   */
  switch (changes[0].type) {
    case 'dimensions':
      for (const change_ of changes) {
        const change = change_ as NodeDimensionChange;
        const nodes = canvasDataDraft.nodes as Node[];
        const node = nodes.find((n) => n.id === change.id)!;
        node.height = change.dimensions?.height ?? node.height;
        node.width = change.dimensions?.width ?? node.width;
      }
      break;
    case 'position':
      for (const change_ of changes) {
        const change = change_ as NodePositionChange;
        const nodes = canvasDataDraft.nodes as Node[];
        const node = nodes.find((n) => n.id === change.id)!;
        node.position.x = change.position?.x ?? node.position.x;
        node.position.y = change.position?.y ?? node.position.y;
      }
      break;
    case 'remove': {
      const removedNodeIds: string[] = [];

      for (const change_ of changes) {
        const change = change_ as NodeRemoveChange;
        const index = canvasDataDraft.nodes.findIndex(
          (n) => n.id === change.id,
        );
        canvasDataDraft.nodes.splice(index, 1);
        removedNodeIds.push(change.id);
      }

      removeNodeConfigs(canvasDataDraft, removedNodeIds);
      break;
    }
    case 'select': {
      const nodes = canvasDataDraft.nodes as Node[];
      canvasDataDraft.nodes = applyNodeChanges(changes, nodes);

      const selectedNodes = (canvasDataDraft.nodes as Node[]).filter(
        (node) => node.selected,
      );

      if (selectedNodes.length === 1) {
        canvasStore.set(
          canvasLeftSidePanelTypeAtom,
          LeftSidePanelType.Inspector,
        );
        canvasStore.set(canvasInspectorSelectedNodeIdAtom, selectedNodes[0].id);
      } else {
        canvasStore.set(canvasInspectorSelectedNodeIdAtom, null);
      }
      break;
    }
    case 'add':
    case 'reset': {
      const nodes = canvasDataDraft.nodes as Node[];
      canvasDataDraft.nodes = applyNodeChanges(changes, nodes);
      break;
    }
  }

  const canvasData = finishDraft(canvasDataDraft);
  canvasStore.set(canvasDataAtom, canvasData);
}

export function reactFlowOnEdgesChange(changes: EdgeChange[]): void {
  const canvasDataDraft = createDraft(canvasStore.get(canvasDataAtom));

  /**
   * NOTE: It seems we can safely assume all changes are of the same type.
   */
  switch (changes[0].type) {
    case 'remove': {
      const removedEdgeIds: string[] = (changes as EdgeRemoveChange[]).map(
        (change) => change.id,
      );
      removeEdges(canvasDataDraft, removedEdgeIds);
      break;
    }
    case 'select':
    case 'add':
    case 'reset': {
      const edges = canvasStore.get(canvasEdgesAtom) as Edge[];
      canvasDataDraft.edges = applyEdgeChanges(
        changes,
        edges,
      ) as EdgePersistPartial[];
      break;
    }
  }

  const canvasData = finishDraft(canvasDataDraft);
  canvasStore.set(canvasDataAtom, canvasData);
}

/**
 * Handle onConnect event from reactflow
 */
export function reactFlowOnConnect(connection: Connection): void {
  /**
   * ANCHOR: Validate
   */

  // NOTE: Can't connect to itself
  if (connection.source === connection.target) {
    return;
  }

  const { sourceHandle, targetHandle } = connection;

  invariant(sourceHandle != null, 'sourceHandle is not null');
  invariant(targetHandle != null, 'targetHandle is not null');

  const connectors = canvasStore.get(canvasConnectorsAtom);
  const sourceConnector = connectors[sourceHandle];
  const targetConnector = connectors[targetHandle];

  const sourceConnectorIsVariable =
    sourceConnector.type === ConnectorType.InputVariable ||
    sourceConnector.type === ConnectorType.OutputVariable;

  const targetConnectorIsVariable =
    targetConnector.type === ConnectorType.InputVariable ||
    targetConnector.type === ConnectorType.OutputVariable;

  // NOTE: Can't connect variable with non-variable
  if (
    (sourceConnectorIsVariable && !targetConnectorIsVariable) ||
    (!sourceConnectorIsVariable && targetConnectorIsVariable)
  ) {
    return;
  }

  /**
   * ANCHOR: Prepare
   */

  const canvasDataDraft = createDraft(canvasStore.get(canvasDataAtom));

  /**
   * ANCHOR: Perform
   */

  const edges = canvasDataDraft.edges as Edge[];
  const newEdgeArray = addEdge(
    {
      ...connection,
      type: sourceConnectorIsVariable ? 'variable' : 'condition',
    },
    edges,
  );
  const addedEdges = difference<Edge>(eqStrict)(newEdgeArray, edges);

  // NOTE: Connection already existed
  if (addedEdges.length === 0) {
    return;
  }

  invariant(addedEdges.length === 1, 'There should be only one new edge');

  const newEdge = addedEdges[0];

  newEdge.id = randomId(); // Assign shorter ID to improve readability

  if (sourceConnectorIsVariable) {
    // NOTE: When the new edge connects two variables

    // TODO: More systematic way to check type compatibility

    // SECTION: Check if this is a replacing or adding
    // NOTE: Incoming variable can only have a single incoming edge

    /**
     * 1) an edge that's not the newEdge (newEdgeArray contains the newEdge)
     * 2) and target the same variable
     */
    const partitionFunc = partition<Edge>(
      (edge) =>
        !(edge.id !== newEdge.id && edge.targetHandle === newEdge.targetHandle),
    );

    const { left: rejectedEdges, right: acceptedEdges } =
      partitionFunc(newEdgeArray);

    if (rejectedEdges.length === 0) {
      // Edge added
    } else {
      // Edge replaced
    }
    // !SECTION

    canvasDataDraft.edges = acceptedEdges as EdgePersistPartial[];
  } else {
    // NOTE: When the new edge connects a condition and a condition target

    /**
     * NOTE: For condition edge, we allow same source with multiple targets
     * as well as same target with multiple sources. Thus, we won't generate
     * edge replace event.
     */

    // Edge added

    canvasDataDraft.edges = newEdgeArray as EdgePersistPartial[];
  }

  /**
   * ANCHOR: Apply
   */

  const canvasData = finishDraft(canvasDataDraft);
  canvasStore.set(canvasDataAtom, canvasData);
}
