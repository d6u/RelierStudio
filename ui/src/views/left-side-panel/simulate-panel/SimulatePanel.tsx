import { css } from '@emotion/react';
import { useAtomValue } from 'jotai';

import { canvasSimulatePanelSelectedStartNodeIdAtom } from '../../../states/atoms/canvas-left-side-panel';
import SimulatePanelInputs from './SimulatePanelInputs';
import SimulatePanelOutputs from './SimulatePanelOutputs';
import SimulatePanelStartNodeSelector from './SimulatePanelStartNodeSelector';

function SimulatePanel() {
  const selectedStartNodeId = useAtomValue(
    canvasSimulatePanelSelectedStartNodeIdAtom,
  );

  return (
    <div
      css={css`
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `}
    >
      <SimulatePanelStartNodeSelector />
      {selectedStartNodeId != null && <SimulatePanelInputs />}
      {selectedStartNodeId != null && <SimulatePanelOutputs />}
    </div>
  );
}

export default SimulatePanel;
