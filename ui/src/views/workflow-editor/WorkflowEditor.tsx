import { css } from '@emotion/react';
import { useAtomValue } from 'jotai';

import { canvasLeftSidePanelExpandedAtom } from '../../states/atoms/canvas-left-side-panel';
import CanvasView from '../canvas/CanvasView';
import LeftMenuBar from '../left-menu-bar/LeftMenuBar';
import LeftSidePanelView from '../left-side-panel/LeftSidePanelView';
import TopBarView from '../top-bar/TopBarView';

function WorkflowEditor() {
  const leftSidePanelExpanded = useAtomValue(canvasLeftSidePanelExpandedAtom);

  return (
    <>
      <LeftMenuBar />
      <div
        css={css`
          height: 100vh;
          display: grid;
          grid-template-rows: 50px auto;
          grid-template-columns: ${leftSidePanelExpanded ? '800px' : '400px'} auto;
          grid-template-areas:
            'top-bar top-bar'
            'left-side-panel canvas';

          // Prevent children from expanding the parent grid
          & > * {
            min-height: 0;
            min-width: 0;
          }
        `}
      >
        <TopBarView />
        <LeftSidePanelView />
        <CanvasView />
      </div>
    </>
  );
}

export default WorkflowEditor;
