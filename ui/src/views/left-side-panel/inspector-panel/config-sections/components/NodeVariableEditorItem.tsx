import { css } from '@emotion/react';
import { IconButton, Input } from '@mui/joy';
import { useImmerAtom } from 'jotai-immer';
import { focusAtom } from 'jotai-optics';
import { type Lens, type OpticParams } from 'optics-ts';
import { useMemo } from 'react';
import invariant from 'tiny-invariant';

import {
  ConnectorType,
  type InputVariable,
  type OutputVariable,
} from 'canvas-data-base';
import type { ConnectorRecords } from 'run-flow';

import IconArrowRight from '../../../../../icons/IconArrowRight';
import IconArrowTurnLeftDown from '../../../../../icons/IconArrowTurnLeftDown';
import IconArrowTurnUpRight from '../../../../../icons/IconArrowTurnUpRight';
import IconTrash from '../../../../../icons/IconTrash';
import { canvasConnectorsAtom } from '../../../../../states/atoms/canvas-data';
import NodeVariableEditorItemReferenceSelect from './NodeVariableEditorItemReferenceSelect';

type Props = {
  variableId: string;
  readonlyNameInput?: boolean;
  onDelete?: () => void;
};

function NodeVariableEditorItem(props: Props) {
  const [variable, setVariable] = useImmerAtom(
    useMemo(
      () =>
        focusAtom(canvasConnectorsAtom, (optic) => {
          return optic.prop(props.variableId) as Lens<
            ConnectorRecords,
            OpticParams,
            InputVariable | OutputVariable
          >;
        }),
      [props.variableId],
    ),
  );

  invariant(
    variable.type === ConnectorType.InputVariable ||
      variable.type === ConnectorType.OutputVariable,
    'Must be an input or output variable.',
  );

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 5px;
      `}
    >
      <div
        css={css`
          display: flex;
          gap: 5px;
        `}
      >
        <IconButton
          variant="outlined"
          onClick={() => {
            setVariable((draft) => {
              draft.isReference = !draft.isReference;
            });
          }}
        >
          {variable.isReference ? (
            variable.type === ConnectorType.InputVariable ? (
              <IconArrowTurnUpRight
                css={css`
                  width: 14px;
                  height: 14px;
                `}
              />
            ) : (
              <IconArrowTurnLeftDown
                css={css`
                  width: 14px;
                  height: 14px;
                `}
              />
            )
          ) : (
            <IconArrowRight
              css={css`
                width: 14px;
                height: 14px;
              `}
            />
          )}
        </IconButton>
        <Input
          css={css`
            flex-grow: 1;
          `}
          size="sm"
          variant="outlined"
          disabled={props.readonlyNameInput}
          value={variable.name}
          onChange={(event) => {
            setVariable((draft) => {
              draft.name = event.target.value;
            });
          }}
        />
        {props.onDelete && (
          <IconButton
            variant="outlined"
            onClick={() => {
              props.onDelete!();
            }}
          >
            <IconTrash
              css={css`
                width: 16px;
                height: 16px;
              `}
            />
          </IconButton>
        )}
      </div>
      {variable.isReference && (
        <div
          css={css`
            display: flex;
            gap: 5px;
          `}
        >
          <NodeVariableEditorItemReferenceSelect
            variable={variable}
            setVariable={setVariable}
          />
        </div>
      )}
    </div>
  );
}

export default NodeVariableEditorItem;
