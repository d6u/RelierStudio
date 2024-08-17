import { css } from '@emotion/react';
import { useAtomValue } from 'jotai';
import invariant from 'tiny-invariant';

import { ConnectorType } from 'canvas-data-base';

import { canvasConnectorsAtom } from '../../../states/atoms/canvas-data';
import {
  canvasRunDataRecordsAtom,
  canvasSelectedRunDataIdAtom,
} from '../../../states/atoms/canvas-run-data';

type Props = {
  variableId: string;
};

function VariableResult(props: Props) {
  const connectors = useAtomValue(canvasConnectorsAtom);
  const runDataRecords = useAtomValue(canvasRunDataRecordsAtom);
  const selectedRunDataId = useAtomValue(canvasSelectedRunDataIdAtom);

  const connector = connectors[props.variableId];

  invariant(
    connector.type === ConnectorType.InputVariable ||
      connector.type === ConnectorType.OutputVariable,
    'Connector must be an variable',
  );

  const runData =
    selectedRunDataId == null ? null : runDataRecords[selectedRunDataId];
  const variableResult = runData?.variableResults[connector.id];

  return (
    <div>
      <div
        css={css`
          font-weight: 500;
          font-size: 12px;
          margin-bottom: 4px;
        `}
      >
        {connector.name}
        {(() => {
          if (variableResult?.value == null) {
            return;
          }

          if (typeof variableResult.value === 'string') {
            return ' (string)';
          }

          if (typeof variableResult.value === 'number') {
            return ' (number)';
          }

          return ' (object)';
        })()}
      </div>
      <pre
        css={css`
          min-height: 30px;
          border: 1px solid #ccc;
          padding: 5px 8px;
          font-size: 12px;
          white-space: break-spaces;
          word-break: break-word;
          border-radius: 6px;
        `}
      >
        {(() => {
          if (variableResult?.value == null) {
            return 'null';
          }

          if (typeof variableResult.value === 'string') {
            return variableResult.value;
          }

          if (typeof variableResult.value === 'number') {
            return variableResult.value;
          }

          return JSON.stringify(variableResult.value, null, 2);
        })()}
      </pre>
    </div>
  );
}

export default VariableResult;
