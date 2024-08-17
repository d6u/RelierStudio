import { css } from '@emotion/react';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import {
  canvasNodeConfigsAtom,
  selectFinishNodeIdsAtom,
} from '../../../states/atoms/canvas-data';
import VariableResult from '../components/VariableResult';

function SimulatePanelOutputs() {
  const nodeConfigs = useAtomValue(canvasNodeConfigsAtom);
  const finishNodeIds = useAtomValue(selectFinishNodeIdsAtom);

  const finishNodeInputVariableIds = useMemo(() => {
    return finishNodeIds.flatMap((nodeId) => {
      return nodeConfigs[nodeId].inputVariableIds;
    });
  }, [finishNodeIds, nodeConfigs]);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 10px;
      `}
    >
      {finishNodeInputVariableIds.map((variableId) => {
        return <VariableResult key={variableId} variableId={variableId} />;
      })}
    </div>
  );
}

export default SimulatePanelOutputs;
