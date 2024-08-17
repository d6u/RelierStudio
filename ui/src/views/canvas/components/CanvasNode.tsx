import { useAtomValue } from 'jotai';
import type { NodeProps } from 'reactflow';

import { canvasNodeConfigsAtom } from '../../../states/atoms/canvas-data';
import CanvasNodeConnectors from './CanvasNodeConnectors';
import CanvasNodeContainer from './CanvasNodeContainer';
import CanvasNodeHeader from './CanvasNodeHeader';

function CanvasNode(props: NodeProps) {
  const nodeConfigs = useAtomValue(canvasNodeConfigsAtom);
  const nodeConfig = nodeConfigs[props.id];

  if (nodeConfig == null) {
    return null;
  }

  return (
    <CanvasNodeContainer
      nodeId={props.id}
      selected={props.selected}
      dragging={props.dragging}
    >
      <CanvasNodeHeader nodeConfig={nodeConfig} />
      <CanvasNodeConnectors nodeConfig={nodeConfig} />
    </CanvasNodeContainer>
  );
}

export default CanvasNode;
