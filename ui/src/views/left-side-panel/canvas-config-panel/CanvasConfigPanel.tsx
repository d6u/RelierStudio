import { css } from '@emotion/react';
import { FormControl, FormLabel, Input } from '@mui/joy';
import { produce } from 'immer';
import { useAtom } from 'jotai';
import { RESET } from 'jotai/utils';

import { CANVAS_CONFIG_DEFINITIONS } from 'canvas-config-definitions';

import { canvasConfigsAtom } from '../../../states/atoms/canvas-config';
import { canvasConfigFocusInputKeyAtom } from '../../../states/atoms/canvas-left-side-panel';

function CanvasConfigPanel() {
  const [canvasConfigs, setCanvasConfigs] = useAtom(canvasConfigsAtom);
  const [canvasConfigFocusInputKey, setCanvasConfigFocusInputKey] = useAtom(
    canvasConfigFocusInputKeyAtom,
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
      {canvasConfigs.map((config) => {
        const canvasConfigDef = CANVAS_CONFIG_DEFINITIONS[config.key];

        return (
          <FormControl key={config.key}>
            <FormLabel>{canvasConfigDef.label}</FormLabel>
            <Input
              type="password"
              slotProps={{
                input: {
                  ref: (input: HTMLInputElement) => {
                    if (input && config.key === canvasConfigFocusInputKey) {
                      input.focus();
                      setCanvasConfigFocusInputKey(RESET);
                    }
                  },
                },
              }}
              value={config.value}
              onChange={(event) => {
                setCanvasConfigs((prev) => {
                  return produce(prev, (draft) => {
                    for (const canvasConfig of draft) {
                      if (canvasConfig.key === config.key) {
                        canvasConfig.value = event.target.value;
                        break;
                      }
                    }
                  });
                });
              }}
            />
          </FormControl>
        );
      })}
    </div>
  );
}

export default CanvasConfigPanel;
