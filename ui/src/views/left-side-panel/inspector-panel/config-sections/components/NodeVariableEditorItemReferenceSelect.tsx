import { css as rawCss } from '@emotion/css';
import { css } from '@emotion/react';
import { useAtomValue } from 'jotai';
import { useImmerAtom } from 'jotai-immer';
import { type ComponentType, useMemo } from 'react';
import {
  type GroupBase,
  type SingleValueProps,
  components,
} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import type { Edge } from 'reactflow';
import invariant from 'tiny-invariant';

import {
  ConnectorType,
  type InputVariable,
  type OutputVariable,
} from 'canvas-data-base';
import randomId from 'common-utils/randomId';

import IconWarning from '../../../../../icons/IconWarning';
import {
  canvasConnectorsAtom,
  canvasEdgesAtom,
  canvasGlobalVariablesAtom,
  canvasNodeConfigsAtom,
} from '../../../../../states/atoms/canvas-data';

type Option = {
  value: string;
  label: string;
  isReferenceInvalid?: boolean;
};

type Props = {
  variable: InputVariable | OutputVariable;
  setVariable: (fn: (draft: InputVariable | OutputVariable) => void) => void;
};

function NodeVariableEditorItemReferenceSelect(props: Props) {
  const edges = useAtomValue(canvasEdgesAtom) as Edge[];
  const nodeConfigs = useAtomValue(canvasNodeConfigsAtom);
  const connectors = useAtomValue(canvasConnectorsAtom);

  const [globalVariables, setGlobalVariables] = useImmerAtom(
    canvasGlobalVariablesAtom,
  );

  const preceedingNodeIds = useMemo(() => {
    const preceedingNodeIds = new Set<string>();
    let nodeIds = new Set<string>([props.variable.nodeId]);

    while (nodeIds.size > 0) {
      const newNodeIds = new Set<string>();

      for (const nodeId of nodeIds) {
        for (const edge of edges) {
          if (
            edge.target === nodeId &&
            !edge.hidden &&
            !preceedingNodeIds.has(edge.source)
          ) {
            preceedingNodeIds.add(edge.source);
            newNodeIds.add(edge.source);
          }
        }
      }

      nodeIds = newNodeIds;
    }

    return preceedingNodeIds;
  }, [edges, props.variable.nodeId]);

  const options = useMemo<GroupBase<Option>[]>(() => {
    const globalVariableOptions = Object.values(globalVariables).map(
      (globalVariable) => {
        return {
          value: globalVariable.id,
          label: globalVariable.name,
        };
      },
    );

    // NOTE: Output variable can only output to global references
    if (props.variable.type === ConnectorType.OutputVariable) {
      return [
        {
          options: globalVariableOptions,
          label: 'Global Variables',
        },
      ];
    }

    /**
     * NOTE: Input variable can reference global variable and preceeding
     * output variables
     */

    const outputVariables = Object.values(connectors).filter(
      (connector): connector is OutputVariable => {
        return connector.type === ConnectorType.OutputVariable;
      },
    );

    const preceedingVariableOptions = Array.from(preceedingNodeIds)
      .map((nodeId) => {
        return outputVariables
          .filter((outputVariable) => outputVariable.nodeId === nodeId)
          .map((outputVariable) => {
            return {
              value: outputVariable.id,
              label: `${outputVariable.name} (${nodeConfigs[nodeId].name})`,
            };
          });
      })
      .flat();

    return [
      {
        options: globalVariableOptions,
        label: 'Global Variables',
      },
      {
        options: preceedingVariableOptions,
        label: 'Preceeding Output Variables',
      },
    ];
  }, [
    connectors,
    globalVariables,
    nodeConfigs,
    preceedingNodeIds,
    props.variable.type,
  ]);

  const selectedOption = useMemo<Option | null>(() => {
    if (props.variable.referencedVariableId == null) {
      return null;
    }

    const globalVariable = globalVariables[props.variable.referencedVariableId];
    if (globalVariable != null) {
      return {
        value: globalVariable.id,
        label: globalVariable.name,
      };
    }

    const outputVariable = connectors[props.variable.referencedVariableId];
    invariant(
      outputVariable.type === ConnectorType.OutputVariable,
      'Referenced variable be an output variable.',
    );
    return {
      value: outputVariable.id,
      label: `${outputVariable.name} (${nodeConfigs[outputVariable.nodeId].name})`,
      isReferenceInvalid: !preceedingNodeIds.has(outputVariable.nodeId),
    };
  }, [
    props.variable.referencedVariableId,
    globalVariables,
    connectors,
    nodeConfigs,
    preceedingNodeIds,
  ]);

  return (
    <div
      css={css`
        flex-grow: 1;
      `}
    >
      <CreatableSelect
        ref={() => {}}
        classNames={{
          container: () => rawCss`
            font-size: 14px;
          `,
          control: () => rawCss`
            border-radius: 6px;
          `,
          valueContainer: () => rawCss`
            padding: 0 8px;
          `,
        }}
        theme={(theme) => ({
          ...theme,
          spacing: {
            ...theme.spacing,
            baseUnit: 2,
            controlHeight: 32,
          },
        })}
        components={{
          SingleValue: CustomSingleValue,
        }}
        isClearable
        placeholder="Select a variable reference"
        formatCreateLabel={(inputValue) =>
          `Create global variable "${inputValue}"`
        }
        options={options}
        value={selectedOption}
        onCreateOption={(name) => {
          const newGlobalVariableId = randomId();

          setGlobalVariables((draft) => {
            draft[newGlobalVariableId] = {
              id: newGlobalVariableId,
              name: name,
            };
          });

          props.setVariable((draft) => {
            draft.referencedVariableId = newGlobalVariableId;
          });
        }}
        onChange={(option) => {
          props.setVariable((draft) => {
            draft.referencedVariableId = option?.value ?? null;
          });
        }}
      />
      {selectedOption?.isReferenceInvalid && (
        <div
          css={css`
            margin-top: 5px;
            font-size: 12px;
            font-weight: 500;
            color: #ff3939;
          `}
        >
          The node of the selected variable is not a preceeding node. Try adjust
          the edges.
        </div>
      )}
    </div>
  );
}

const CustomSingleValue: ComponentType<
  SingleValueProps<Option, false, GroupBase<Option>>
> = ({ children, ...props }) => {
  return (
    <components.SingleValue
      css={css`
        display: flex;
        align-items: center;
        gap: 5px;
      `}
      {...props}
    >
      {props.data.isReferenceInvalid && (
        <IconWarning
          css={css`
            display: inline;
            fill: #ff8100;
            height: 16px;
            width: 16px;
            text-align: center;
          `}
        />
      )}
      {children}
    </components.SingleValue>
  );
};

export default NodeVariableEditorItemReferenceSelect;
