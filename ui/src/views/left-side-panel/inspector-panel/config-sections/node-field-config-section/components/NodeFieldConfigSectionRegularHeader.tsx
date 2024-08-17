import { css } from '@emotion/react';
import { IconButton } from '@mui/joy';

import IconArrowLeftArrowRight from '../../../../../../icons/IconArrowLeftArrowRight';
import { switchConfigFieldActiveConfig } from '../../../../../../states/actions/field-config';

type Props = {
  nodeId: string;
  fieldKey: string;
  fieldLabel: string;
  hasMultipleOptions: boolean;
  fieldConfigSectionIndex: number;
};

function NodeFieldConfigSectionRegularHeader(props: Props) {
  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 32px;
      `}
    >
      <div
        css={css`
          font-size: 14px;
          font-weight: 500;
        `}
      >
        {props.fieldLabel}
      </div>
      {props.hasMultipleOptions && (
        <div>
          <IconButton
            css={css`
              &:hover {
                background-color: transparent;
              }
              &:hover > svg {
                fill: #0189ff;
              }
            `}
            variant="plain"
            onClick={() => {
              switchConfigFieldActiveConfig({
                nodeId: props.nodeId,
                fieldConfigSectionIndex: props.fieldConfigSectionIndex,
                fieldKey: props.fieldKey,
              });
            }}
          >
            <IconArrowLeftArrowRight
              css={css`
                width: 16px;
                height: 16px;
              `}
            />
          </IconButton>
        </div>
      )}
    </div>
  );
}

export default NodeFieldConfigSectionRegularHeader;
