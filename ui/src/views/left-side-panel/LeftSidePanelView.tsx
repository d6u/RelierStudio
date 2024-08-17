import { css } from '@emotion/react';
import { useAtomValue } from 'jotai';

import {
  LeftSidePanelType,
  canvasLeftSidePanelTypeAtom,
} from '../../states/atoms/canvas-left-side-panel';
import AddNodePanel from './add-node-panel/AddNodePanel';
import CanvasConfigPanel from './canvas-config-panel/CanvasConfigPanel';
import NodeInspectorPanel from './inspector-panel/NodeInspectorPanel';
import RunHistoryPanel from './run-history-panel/RunHistoryPanel';
import SimulatePanel from './simulate-panel/SimulatePanel';

function LeftSidePanelView() {
  const leftSidePanelType = useAtomValue(canvasLeftSidePanelTypeAtom);

  return (
    <div
      css={css`
        grid-area: left-side-panel;
        border-right: 1px solid #e0e0e0;
        overflow-y: auto;
      `}
    >
      {(() => {
        switch (leftSidePanelType) {
          case LeftSidePanelType.AddNode:
            return <AddNodePanel />;
          case LeftSidePanelType.Inspector:
            return <NodeInspectorPanel />;
          case LeftSidePanelType.Simulate:
            return <SimulatePanel />;
          case LeftSidePanelType.CavnasConfig:
            return <CanvasConfigPanel />;
          case LeftSidePanelType.RunHistories:
            return <RunHistoryPanel />;
        }
      })()}
    </div>
  );
}

export default LeftSidePanelView;
