import { css } from '@emotion/react';
import { FormControl, FormLabel, Option, Select } from '@mui/joy';
import { useAtom, useAtomValue } from 'jotai';

import {
  canvasRunDataRecordsAtom,
  canvasSelectedRunDataIdAtom,
} from '../../../states/atoms/canvas-run-data';

function RunHistoryPanel() {
  const [selectedRunDataId, setSelectedRunDataId] = useAtom(
    canvasSelectedRunDataIdAtom,
  );
  const runDataRecords = useAtomValue(canvasRunDataRecordsAtom);

  return (
    <div
      css={css`
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `}
    >
      <FormControl>
        <FormLabel>Select a history ID</FormLabel>
        <Select
          placeholder="Select a run history"
          value={selectedRunDataId}
          onChange={(_event, value) => {
            setSelectedRunDataId(value);
          }}
        >
          {Object.values(runDataRecords)
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((runData) => {
              const date = new Date(runData.updatedAt);

              return (
                <Option
                  key={runData.id}
                  value={runData.id}
                  label={runData.name}
                >
                  <div
                    css={css`
                      width: 100%;
                      display: flex;
                      justify-content: space-between;
                    `}
                  >
                    <span>{runData.name}</span>
                    <span
                      css={css`
                        color: #666;
                      `}
                    >
                      {/* Looks like: 1:23:45 AM, 1/02/2000 */}
                      {date.toLocaleTimeString()}, {date.toLocaleDateString()}
                    </span>
                  </div>
                </Option>
              );
            })}
        </Select>
      </FormControl>
    </div>
  );
}

export default RunHistoryPanel;
