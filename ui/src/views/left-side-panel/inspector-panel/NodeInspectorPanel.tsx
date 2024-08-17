import { css } from '@emotion/react';
import { useAtomValue } from 'jotai';

import { canvasNodeConfigsAtom } from '../../../states/atoms/canvas-data';
import { canvasInspectorSelectedNodeIdAtom } from '../../../states/atoms/canvas-left-side-panel';
import NodeInspectorPanelInner from './NodeInspectorPanelInner';

function NodeInspectorPanel() {
  const selectedNodeId = useAtomValue(canvasInspectorSelectedNodeIdAtom);
  const nodeConfigs = useAtomValue(canvasNodeConfigsAtom);

  if (selectedNodeId == null || nodeConfigs[selectedNodeId] == null) {
    return (
      <div
        css={css`
          padding: 15px;
        `}
      >
        Select a node to inspect
      </div>
    );
  }

  return (
    <NodeInspectorPanelInner selectedNodeConfig={nodeConfigs[selectedNodeId]} />
  );
}

export default NodeInspectorPanel;
