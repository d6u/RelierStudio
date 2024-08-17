import { css } from '@emotion/react';
import type { ComponentProps } from 'react';
import { Handle } from 'reactflow';

import { HANDLE_DIAMETER } from '../../../constants/canvas-constants';

export function ConditionHandle(
  props: ComponentProps<typeof Handle> & { connected: boolean },
) {
  const { connected, ...restProps } = props;

  return (
    <Handle
      css={css`
        width: ${HANDLE_DIAMETER}px;
        height: ${HANDLE_DIAMETER}px;
        background: ${connected
          ? 'var(--canvas-handle-condition-color-heavy)'
          : 'white'};
        border: 2px solid var(--canvas-handle-condition-color-heavy);
      `}
      {...restProps}
    />
  );
}

export function VariableHandle(
  props: ComponentProps<typeof Handle> & { connected: boolean },
) {
  const { connected, ...restProps } = props;

  return (
    <Handle
      css={css`
        width: ${HANDLE_DIAMETER}px;
        height: ${HANDLE_DIAMETER}px;
        background: ${connected
          ? 'var(--canvas-handle-variable-color-heavy)'
          : 'white'};
        border: 2px solid var(--canvas-handle-variable-color-heavy);
      `}
      {...restProps}
    />
  );
}
