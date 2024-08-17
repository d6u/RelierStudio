import { css } from '@emotion/react';

import type { NodeConfig } from 'canvas-data-unified';

import NodeInspectorHeader from './NodeInspectorHeader';
import NodeInspectorConfigSections from './config-sections/NodeInspectorConfigSections';
import NodeInspectorDebugSection from './debug-section/NodeInspectorDebugSection';

type Props = {
  selectedNodeConfig: NodeConfig;
};

function NodeInspectorPanelInner(props: Props) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px 0;
      `}
    >
      <NodeInspectorHeader nodeConfig={props.selectedNodeConfig} />
      <NodeInspectorConfigSections nodeConfig={props.selectedNodeConfig} />
      <NodeInspectorDebugSection nodeConfig={props.selectedNodeConfig} />
    </div>
  );
}

export default NodeInspectorPanelInner;
