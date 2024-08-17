import { ClassNames, css } from '@emotion/react';
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
} from '@mui/joy';
import * as RR from 'fp-ts/ReadonlyRecord';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import {
  NodeConfigFieldType,
  NodeDefinitionConfigSectionKind,
} from 'canvas-data-base';
import { NODE_DEFINITIONS, type NodeConfig } from 'canvas-data-unified';

import {
  canvasRunDataRecordsAtom,
  canvasSelectedRunDataIdAtom,
} from '../../../../states/atoms/canvas-run-data';
import VariableResult from '../../components/VariableResult';
import NodeInspectorRunDataSelector from './NodeInspectorRunDataSelector';

type Props = {
  nodeConfig: NodeConfig;
};

function NodeInspectorDebugSection(props: Props) {
  const runDataRecords = useAtomValue(canvasRunDataRecordsAtom);
  const selectedRunDataId = useAtomValue(canvasSelectedRunDataIdAtom);

  const runData =
    selectedRunDataId == null ? null : runDataRecords[selectedRunDataId];
  const nodeParams = runData?.nodeParams[props.nodeConfig.nodeId];

  const canvasConfigFieldKeys = useMemo(() => {
    const nodeDef = NODE_DEFINITIONS[props.nodeConfig.type];
    const keys: string[] = [];

    for (const section of nodeDef.sections) {
      if (section.kind === NodeDefinitionConfigSectionKind.Field) {
        const field = props.nodeConfig.fields[section.key];
        if (
          section.options[field.index].type === NodeConfigFieldType.CanvasConfig
        ) {
          keys.push(section.key);
        }
      }
    }

    return keys;
  }, [props.nodeConfig.fields, props.nodeConfig.type]);

  const selectedNodeParams: Record<string, unknown> = useMemo(() => {
    const selected: Record<string, unknown> = {};

    if (nodeParams) {
      for (const [key, value] of Object.entries(nodeParams)) {
        if (key === 'kind' || key === 'type' || key === 'nodeId') {
          continue;
        } else if (canvasConfigFieldKeys.includes(key)) {
          selected[key] = '!!HIDDE_VALUE!!';
        } else {
          selected[key] = value;
        }
      }
    }

    return selected;
  }, [canvasConfigFieldKeys, nodeParams]);

  return (
    <div
      css={css`
        padding: 10px 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: #fdffe7;
      `}
    >
      <NodeInspectorRunDataSelector />
      {!RR.isEmpty(selectedNodeParams) && (
        <AccordionGroup>
          <Accordion
            css={css`
              padding: 0;
              margin: 0;
            `}
          >
            <ClassNames>
              {({ css }) => (
                <AccordionSummary
                  css={css`
                    padding: 0;
                    margin: 0;
                  `}
                  slotProps={{
                    button: {
                      className: css`
                        &:not(.Mui-selected, [aria-selected='true']):hover {
                          background-color: transparent;
                        }
                        font-size: 14px;
                        font-weight: 500;
                        color: black;
                      `,
                    },
                  }}
                >
                  Node Parameters
                </AccordionSummary>
              )}
            </ClassNames>
            <AccordionDetails>
              <pre
                css={css`
                  border: 1px solid #ccc;
                  border-radius: 6px;
                  padding: 5px 8px;
                  font-size: 14px;
                  white-space: break-spaces;
                  word-wrap: break-word;
                `}
              >
                {JSON.stringify(selectedNodeParams, null, 2)}
              </pre>
            </AccordionDetails>
          </Accordion>
        </AccordionGroup>
      )}
      {props.nodeConfig.inputVariableIds.length > 0 && (
        <>
          <div
            css={css`
              font-size: 14px;
              font-weight: 500;
            `}
          >
            Input variables
          </div>
          {props.nodeConfig.inputVariableIds.map((variableId) => {
            return <VariableResult key={variableId} variableId={variableId} />;
          })}
        </>
      )}
      {props.nodeConfig.outputVariableIds.length > 0 && (
        <>
          <div
            css={css`
              font-size: 14px;
              font-weight: 500;
            `}
          >
            Output variables
          </div>
          {props.nodeConfig.outputVariableIds.map((variableId) => {
            return <VariableResult key={variableId} variableId={variableId} />;
          })}
        </>
      )}
    </div>
  );
}

export default NodeInspectorDebugSection;
