import { css } from '@emotion/react';
import { IconButton, Radio, RadioGroup, Textarea } from '@mui/joy';

import {
  type LlmMessageConfig,
  LlmMessageContentSource,
  type LlmMessageContentSourceEnum,
  LlmMessageRole,
  type LlmMessageRoleEnum,
} from 'canvas-data-base';

import IconArrowLeftArrowRight from '../../../../../../icons/IconArrowLeftArrowRight';
import IconTrash from '../../../../../../icons/IconTrash';
import NodeVariableEditorItem from '../../components/NodeVariableEditorItem';

type Props = {
  messageConfig: LlmMessageConfig;
  onContentSourceChange: (
    contentSourceType: LlmMessageContentSourceEnum,
  ) => void;
  onContentInlineChange: (contentInline: string) => void;
  onRoleChange: (role: LlmMessageRoleEnum) => void;
  onDelete: () => void;
};

function LlmMessageConfigItem(props: Props) {
  return (
    <div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            gap: 5px;
          `}
        >
          <IconButton
            variant="plain"
            onClick={() => {
              props.onContentSourceChange(
                props.messageConfig.contentSourceType ===
                  LlmMessageContentSource.Inline
                  ? LlmMessageContentSource.Variable
                  : LlmMessageContentSource.Inline,
              );
            }}
          >
            <IconArrowLeftArrowRight
              css={css`
                width: 16px;
                height: 16px;
              `}
            />
          </IconButton>
          <RadioGroup
            orientation="horizontal"
            value={props.messageConfig.role}
            onChange={(event) => {
              props.onRoleChange(event.target.value as LlmMessageRoleEnum);
            }}
          >
            {Object.keys(LlmMessageRole).map((key) => (
              <Radio
                key={key}
                label={key}
                value={LlmMessageRole[key as keyof typeof LlmMessageRole]}
              />
            ))}
          </RadioGroup>
        </div>
        <IconButton
          variant="plain"
          onClick={() => {
            props.onDelete();
          }}
        >
          <IconTrash
            css={css`
              width: 16px;
              height: 16px;
            `}
          />
        </IconButton>
      </div>
      {props.messageConfig.contentSourceType ===
      LlmMessageContentSource.Inline ? (
        <>
          <Textarea
            css={css`
              margin-bottom: 5px;
            `}
            minRows={2}
            placeholder="Enter message content"
            value={props.messageConfig.contentInline}
            onChange={(event) => {
              props.onContentInlineChange(event.target.value);
            }}
          />
          <div
            css={css`
              font-family: var(--font-family);
              font-size: 12px;
              line-height: 1.3;
              color: #555e68;
            `}
          >
            <a
              href="https://mustache.github.io/"
              target="_blank"
              rel="noreferrer"
            >
              Mustache template
            </a>{' '}
            is used here. Use triple{' '}
            <b>
              <code>{'{}'}</code>
            </b>
            , e.g. <code>{'{{{variableName}}}'}</code>, to insert a variable.
          </div>
        </>
      ) : (
        <NodeVariableEditorItem
          variableId={props.messageConfig.contentVariableId!}
        />
      )}
    </div>
  );
}

export default LlmMessageConfigItem;
