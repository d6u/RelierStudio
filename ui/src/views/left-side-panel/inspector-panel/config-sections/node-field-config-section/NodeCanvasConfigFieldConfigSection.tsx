import { css } from '@emotion/react';
import { Button } from '@mui/joy';
import { useSetAtom } from 'jotai';

import type { NodeConfigCanvasConfigFieldDefinition } from 'canvas-data-base';

import {
  LeftSidePanelType,
  canvasConfigFocusInputKeyAtom,
  canvasLeftSidePanelTypeAtom,
} from '../../../../../states/atoms/canvas-left-side-panel';
import NodeFieldConfigSectionRegularHeader from './components/NodeFieldConfigSectionRegularHeader';

type Props = {
  nodeId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldSchema: Zod.Schema;
  fieldIndex: number;
  fieldDef: NodeConfigCanvasConfigFieldDefinition;
  hasMultipleOptions: boolean;
  fieldConfigSectionIndex: number;
};

function NodeCanvasConfigFieldConfigSection(props: Props) {
  const setLeftSidePanelType = useSetAtom(canvasLeftSidePanelTypeAtom);
  const setCanvasConfigFocusInputKey = useSetAtom(
    canvasConfigFocusInputKeyAtom,
  );

  return (
    <div
      css={css`
        padding: 0 10px;
      `}
    >
      <NodeFieldConfigSectionRegularHeader
        nodeId={props.nodeId}
        fieldKey={props.fieldKey}
        fieldLabel={props.fieldLabel}
        hasMultipleOptions={props.hasMultipleOptions}
        fieldConfigSectionIndex={props.fieldConfigSectionIndex}
      />
      <Button
        variant="outlined"
        fullWidth
        onClick={() => {
          setCanvasConfigFocusInputKey(props.fieldDef.canvasConfigKey);
          setLeftSidePanelType(LeftSidePanelType.CavnasConfig);
        }}
      >
        Configurate this field in Settings panel
      </Button>
    </div>
  );
}

export default NodeCanvasConfigFieldConfigSection;
