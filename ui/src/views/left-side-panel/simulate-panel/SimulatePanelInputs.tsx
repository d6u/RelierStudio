import { css } from '@emotion/react';
import { Button, FormControl, FormLabel, Textarea } from '@mui/joy';
import { useAtomValue } from 'jotai';
import { useImmerAtom } from 'jotai-immer';
import invariant from 'tiny-invariant';

import { ConnectorType } from 'canvas-data-base';
import { INPUT_NODE_DEFINITION } from 'canvas-data-node-definitions';
import type { VariableResultRecords } from 'run-flow';

import {
  simulateRunFlow,
  stopRunFlow,
} from '../../../states/actions/simulate-run-flow';
import {
  canvasConnectorsAtom,
  canvasNodeConfigsAtom,
} from '../../../states/atoms/canvas-data';
import {
  canvasSimulatePanelInputValuesAtom,
  canvasSimulatePanelSelectedStartNodeIdAtom,
} from '../../../states/atoms/canvas-left-side-panel';
import { canvasRunFlowSubscriptionAtom } from '../../../states/atoms/canvas-run-data';

function SimulatePanelInputs() {
  const nodeConfigs = useAtomValue(canvasNodeConfigsAtom);
  const connectors = useAtomValue(canvasConnectorsAtom);
  const selectedStartNodeId = useAtomValue(
    canvasSimulatePanelSelectedStartNodeIdAtom,
  );
  const runFlowSubscription = useAtomValue(canvasRunFlowSubscriptionAtom);

  invariant(selectedStartNodeId != null, 'Selected nodeId should not be null');

  const selectedStartNodeConfig = nodeConfigs[selectedStartNodeId];

  invariant(
    selectedStartNodeConfig.type === INPUT_NODE_DEFINITION.type,
    'Node must be an Input node',
  );

  const [inputValues, setInputValues] = useImmerAtom(
    canvasSimulatePanelInputValuesAtom,
  );

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 10px;
      `}
    >
      {selectedStartNodeConfig.outputVariableIds.map((id) => {
        const variable = connectors[id];

        invariant(
          variable.type === ConnectorType.OutputVariable,
          'Variable must be an output variable',
        );

        return (
          <FormControl key={id}>
            <FormLabel>{variable.name}</FormLabel>
            <Textarea
              minRows={2}
              value={inputValues[id] ?? ''}
              onChange={(event) => {
                setInputValues((draft) => {
                  draft[id] = event.target.value;
                });
              }}
            />
          </FormControl>
        );
      })}
      {runFlowSubscription == null ? (
        <Button
          color="success"
          fullWidth
          onClick={() => {
            const inputVariableResults: VariableResultRecords = {};
            selectedStartNodeConfig.outputVariableIds.forEach((id) => {
              inputVariableResults[id] = { value: inputValues[id] };
            });
            simulateRunFlow({ inputVariableResults: inputVariableResults });
          }}
        >
          Run
        </Button>
      ) : (
        <Button
          color="danger"
          fullWidth
          onClick={() => {
            stopRunFlow();
          }}
        >
          Stop
        </Button>
      )}
    </div>
  );
}

export default SimulatePanelInputs;
