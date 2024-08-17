import { NodeDefinitionConfigSectionKind } from 'canvas-data-base';
import { NODE_DEFINITIONS, type NodeConfig } from 'canvas-data-unified';

import NodeFieldConfigSection from './node-field-config-section/NodeFieldConfigSection';
import NodeUiConfigSection from './node-ui-config-section/NodeUiConfigSection';

type Props = {
  nodeConfig: NodeConfig;
};

function NodeInspectorConfigSections(props: Props) {
  const nodeDef = NODE_DEFINITIONS[props.nodeConfig.type];

  return (
    <>
      {nodeDef.sections.map((section, index) => {
        if (section.kind === NodeDefinitionConfigSectionKind.UI) {
          return (
            <NodeUiConfigSection
              key={index}
              nodeConfig={props.nodeConfig}
              uiConfigSection={section}
            />
          );
        } else {
          return (
            <NodeFieldConfigSection
              key={index}
              nodeConfig={props.nodeConfig}
              fieldConfigSection={section}
              fieldConfigSectionIndex={index}
            />
          );
        }
      })}
    </>
  );
}

export default NodeInspectorConfigSections;
