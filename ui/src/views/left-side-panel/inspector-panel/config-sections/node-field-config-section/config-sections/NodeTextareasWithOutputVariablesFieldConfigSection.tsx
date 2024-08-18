import { css } from '@emotion/react';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Textarea,
} from '@mui/joy';
import { useImmerAtom } from 'jotai-immer';
import invariant from 'tiny-invariant';

import {
  ConnectorType,
  type NodeConfigTextareasWithOutputVariablesFieldConfig,
  type NodeConfigTextareasWithOutputVariablesFieldDefinition,
} from 'canvas-data-base';

import IconTrash from '../../../../../../icons/IconTrash';
import {
  addEntryToTextareasWithOutputVariablesFieldConfig,
  removeEntryFromTextareasWithOutputVariablesFieldConfig,
} from '../../../../../../states/actions/field-config';
import { canvasConnectorsAtom } from '../../../../../../states/atoms/canvas-data';
import useSetFieldConfigImmerAtom from '../util/useSetNoteFieldConfigImmerAtom';

type Props = {
  nodeId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldSchema: Zod.Schema;
  fieldIndex: number;
  fieldDef: NodeConfigTextareasWithOutputVariablesFieldDefinition;
  hasMultipleOptions: boolean;
  fieldConfigSectionIndex: number;
};

function NodeTextareasWithOutputVariablesFieldConfigSection(props: Props) {
  const [connectors, setConnectors] = useImmerAtom(canvasConnectorsAtom);

  const [fieldConfig, setFieldConfig] =
    useSetFieldConfigImmerAtom<NodeConfigTextareasWithOutputVariablesFieldConfig>(
      props.nodeId,
      props.fieldKey,
      props.fieldIndex,
    );

  return (
    <div
      css={css`
        background-color: #f5f5f5;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 10px;
        `}
      >
        <div
          css={css`
            font-size: 14px;
            font-weight: 500;
            line-height: 32px;
          `}
        >
          {props.fieldLabel}
        </div>
        <Button
          variant="plain"
          onClick={() => {
            addEntryToTextareasWithOutputVariablesFieldConfig({
              nodeId: props.nodeId,
              fieldKey: props.fieldKey,
              fieldIndex: props.fieldIndex,
            });
          }}
        >
          Add
        </Button>
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          padding: 0 10px;
        `}
      >
        {fieldConfig.value.map((entry, index) => {
          const outputVariable = connectors[entry.outputVariableId];

          invariant(
            outputVariable.type === ConnectorType.OutputVariable,
            'Connector must be an OutputVariable',
          );

          return (
            <div
              key={outputVariable.id}
              css={css`
                border-top: 2px solid #42a5ff;
                padding-top: 5px;
                margin-bottom: 10px;
              `}
            >
              <FormControl
                css={css`
                  margin-bottom: 5px;
                `}
              >
                <FormLabel
                  css={css`
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                  `}
                >
                  Output transform
                  <IconButton
                    css={css`
                      min-width: 20px;
                      min-height: 20px;
                    `}
                    variant="plain"
                    onClick={() => {
                      removeEntryFromTextareasWithOutputVariablesFieldConfig({
                        nodeId: props.nodeId,
                        fieldKey: props.fieldKey,
                        fieldIndex: props.fieldIndex,
                        entryIndex: index,
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
                <Textarea
                  minRows={2}
                  placeholder={props.fieldDef.placeholder}
                  value={entry.string}
                  onChange={(event) => {
                    setFieldConfig((draft) => {
                      draft.value[index].string = event.target.value;
                    });
                  }}
                />
                {props.fieldDef.helperText && (
                  <FormHelperText
                    css={css`
                      font-size: 12px;
                      line-height: 1.3;
                    `}
                  >
                    <div>{props.fieldDef.helperText()}</div>
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Output variable name</FormLabel>
                <Input
                  placeholder="Enter output variable name"
                  value={outputVariable.name}
                  onChange={(event) => {
                    setConnectors((draft) => {
                      const outputVariable = draft[entry.outputVariableId];

                      invariant(
                        outputVariable.type === ConnectorType.OutputVariable,
                        'Connector must be an OutputVariable',
                      );

                      outputVariable.name = event.target.value;
                    });
                  }}
                />
              </FormControl>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NodeTextareasWithOutputVariablesFieldConfigSection;
