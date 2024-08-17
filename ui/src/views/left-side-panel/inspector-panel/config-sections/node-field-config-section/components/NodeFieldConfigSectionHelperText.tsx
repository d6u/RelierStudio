import { css } from '@emotion/react';

type Props = {
  fieldDef: {
    helperText?: () => React.ReactNode;
  };
};

function NodeFieldConfigSectionHelperText(props: Props) {
  return (
    props.fieldDef.helperText && (
      <div
        css={css`
          font-size: 12px;
          color: #555e68;
          margin-top: 5px;
        `}
      >
        {props.fieldDef.helperText()}
      </div>
    )
  );
}

export default NodeFieldConfigSectionHelperText;
