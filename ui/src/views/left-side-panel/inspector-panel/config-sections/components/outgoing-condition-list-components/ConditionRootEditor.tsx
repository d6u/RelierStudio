import { css } from '@emotion/react';
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Typography,
} from '@mui/joy';
import { useSetImmerAtom } from 'jotai-immer';

import type { OutgoingCondition } from 'canvas-data-base';

import IconTrash from '../../../../../../icons/IconTrash';
import { removeConnectorOnNode } from '../../../../../../states/actions/remove-connector-on-node';
import { canvasConnectorsAtom } from '../../../../../../states/atoms/canvas-data';
import GroupConditionEditor from './GroupConditionEditor';

type Props = {
  condition: OutgoingCondition;
};

function ConditionRootEditor(props: Props) {
  const setConnectors = useSetImmerAtom(canvasConnectorsAtom);

  return (
    <div
      css={css`
        border-top: 2px solid #e6acff;
        padding-top: 5px;
        overflow-y: auto;
      `}
    >
      <FormControl>
        <FormLabel
          css={css`
            display: flex;
            justify-content: space-between;
            width: 100%;
          `}
        >
          Branch name
          <IconButton
            css={css`
              min-width: 20px;
              min-height: 20px;
            `}
            variant="plain"
            onClick={() => {
              removeConnectorOnNode({
                nodeId: props.condition.nodeId,
                connectorId: props.condition.id,
              });
            }}
          >
            <IconTrash
              css={css`
                width: 14px;
                height: 14px;
              `}
            />
          </IconButton>
        </FormLabel>
        <Input
          placeholder="Enter branch name"
          value={props.condition.name}
          onChange={(event) => {
            setConnectors((draft) => {
              const condition = draft[props.condition.id] as OutgoingCondition;
              condition.name = event.target.value;
            });
          }}
        />
      </FormControl>
      <div>
        <Typography
          css={css`
            color: rgb(23, 26, 28);
            margin-top: 5px;
            margin-bottom: 5px;
          `}
          level="body-xs"
        >
          Rules
        </Typography>
        <GroupConditionEditor
          css={css`
            // Make sure it can take up all width when the left side panel is
            // expanded
            min-width: 100%;
          `}
          condition={props.condition}
          rule={props.condition.rule!}
          path={[]}
        />
      </div>
    </div>
  );
}

export default ConditionRootEditor;
