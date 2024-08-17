import { css } from '@emotion/react';
import { useAtomValue } from 'jotai';
import { Position } from 'reactflow';
import invariant from 'tiny-invariant';

import { ConnectorType, NodeKind } from 'canvas-data-base';
import type { NodeConfig } from 'canvas-data-unified';

import {
  canvasConnectorsAtom,
  canvasEdgesAtom,
} from '../../../states/atoms/canvas-data';
import { ConditionHandle, VariableHandle } from './canvas-node-handles';

type Props = {
  nodeConfig: NodeConfig;
};

function CanvasNodeConnectors(props: Props) {
  const edges = useAtomValue(canvasEdgesAtom);
  const connectors = useAtomValue(canvasConnectorsAtom);

  const hasMultipleIncomingConditions =
    props.nodeConfig.incomingConditionIds.length > 1;

  const hasMultipleOutgoingConditions =
    props.nodeConfig.kind === NodeKind.Condition;

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 5px;
      `}
    >
      {hasMultipleIncomingConditions &&
        props.nodeConfig.incomingConditionIds.map((id) => {
          const incomingCondition = connectors[id];

          invariant(
            incomingCondition.type === ConnectorType.IncomingCondition,
            'Variable must be an incoming condition',
          );

          return (
            <div
              key={id}
              css={css`
                position: relative;
              `}
            >
              <ConditionHandle
                css={css`
                  transform: translate(-50%, -50%);
                  left: -1px;
                `}
                id={id}
                type="target"
                position={Position.Left}
                connected={edges.some((edge) => edge.targetHandle === id)}
              />
              <div
                css={css`
                  font-size: 12px;
                  font-family: var(--font-family-mono);
                  font-weight: bold;
                  padding: 0 10px;
                `}
              >
                {incomingCondition.key}
              </div>
            </div>
          );
        })}
      {props.nodeConfig.inputVariableIds.map((id) => {
        const inputVariable = connectors[id];

        invariant(
          inputVariable.type === ConnectorType.InputVariable,
          'Variable must be an input variable',
        );

        if (inputVariable.isReference) {
          return null;
        }

        return (
          <div
            key={id}
            css={css`
              position: relative;
            `}
          >
            <VariableHandle
              css={css`
                transform: translate(-50%, -50%);
                left: -1px;
              `}
              id={id}
              type="target"
              position={Position.Left}
              connected={edges.some((edge) => edge.targetHandle === id)}
            />
            <div
              css={css`
                font-size: 12px;
                font-family: var(--font-family-mono);
                font-weight: bold;
                padding: 0 10px;
              `}
            >
              {inputVariable.name}
            </div>
          </div>
        );
      })}
      {hasMultipleOutgoingConditions &&
        props.nodeConfig.outgoingConditionIds.slice(1).map((id) => {
          const outgoingCondition = connectors[id];

          invariant(
            outgoingCondition.type === ConnectorType.OutgoingCondition,
            'Variable must be an outgoing condition',
          );

          return (
            <div
              key={id}
              css={css`
                position: relative;
              `}
            >
              <ConditionHandle
                css={css`
                  transform: translate(50%, -50%);
                  right: -1px;
                `}
                id={id}
                type="source"
                position={Position.Right}
                connected={edges.some((edge) => edge.targetHandle === id)}
              />
              <div
                css={css`
                  font-size: 12px;
                  font-family: var(--font-family-mono);
                  font-weight: bold;
                  padding: 0 10px;
                  text-align: right;
                  word-break: break-word;
                `}
              >
                {outgoingCondition.name
                  ? outgoingCondition.name
                  : 'NEED CONFIGURING'}
              </div>
            </div>
          );
        })}
      {hasMultipleOutgoingConditions &&
        (() => {
          const defaultConditionId = props.nodeConfig.outgoingConditionIds[0];
          const outgoingCondition = connectors[defaultConditionId];

          invariant(
            outgoingCondition.type === ConnectorType.OutgoingCondition,
            'Variable must be an outgoing condition',
          );

          return (
            <div
              css={css`
                position: relative;
              `}
            >
              <ConditionHandle
                css={css`
                  transform: translate(50%, -50%);
                  right: -1px;
                `}
                id={defaultConditionId}
                type="source"
                position={Position.Right}
                connected={edges.some(
                  (edge) => edge.targetHandle === defaultConditionId,
                )}
              />
              <div
                css={css`
                  font-size: 12px;
                  font-family: var(--font-family-mono);
                  font-weight: bold;
                  padding: 0 10px;
                  text-align: right;
                  word-break: break-word;
                `}
              >
                {outgoingCondition.key}
              </div>
            </div>
          );
        })()}
      {props.nodeConfig.outputVariableIds.map((id) => {
        const outputVariable = connectors[id];

        invariant(
          outputVariable.type === ConnectorType.OutputVariable,
          'Variable must be an output variable',
        );

        if (outputVariable.isReference) {
          return null;
        }

        return (
          <div
            key={id}
            css={css`
              position: relative;
            `}
          >
            <VariableHandle
              css={css`
                transform: translate(50%, -50%);
                right: -1px;
              `}
              id={id}
              type="source"
              position={Position.Right}
              connected={edges.some((edge) => edge.sourceHandle === id)}
            />
            <div
              css={css`
                font-size: 12px;
                font-family: var(--font-family-mono);
                font-weight: bold;
                padding: 0 10px;
                text-align: right;
              `}
            >
              {outputVariable.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CanvasNodeConnectors;
