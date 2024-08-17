import { css } from '@emotion/react';
import { Chip } from '@mui/joy';

import { NodeKind } from 'canvas-data-base';

import { NODE_KIND_COLORS } from '../../../../constants/node-kind-colors';

type Props = {
  label: string;
};

function NodeTag(props: Props) {
  return (
    <Chip
      css={css`
        border-radius: 5px;
        font-size: 10px;
        font-weight: bold;
        ${(() => {
          switch (props.label) {
            case NodeKind.Start:
              return `background-color: ${NODE_KIND_COLORS[props.label]}; color: white;`;
            case NodeKind.Finish:
              return `background-color: ${NODE_KIND_COLORS[props.label]}; color: white;`;
            case NodeKind.Process:
              return `background-color: ${NODE_KIND_COLORS[props.label]}; color: white;`;
            case NodeKind.Condition:
              return `background-color: ${NODE_KIND_COLORS[props.label]}; color: white;`;
            case NodeKind.Subroutine:
              return `background-color: ${NODE_KIND_COLORS[props.label]}; color: white;`;
            case NodeKind.SubroutineStart:
              return `background-color: ${NODE_KIND_COLORS[props.label]}; color: white;`;
            default:
              return '';
          }
        })()}
      `}
      size="sm"
    >
      {props.label}
    </Chip>
  );
}

export default NodeTag;
