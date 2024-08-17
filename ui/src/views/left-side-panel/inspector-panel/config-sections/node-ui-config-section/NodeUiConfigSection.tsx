import {
  NodeDefinitionConfigSectionUIType,
  type NodeDefinitionUIConfigSection,
} from 'canvas-data-base';
import type { NodeConfig } from 'canvas-data-unified';

import NodeUiConfigVariablesSection from './NodeUiConfigVariablesSection';
import NodeUiOutgoingConditionListSection from './NodeUiOutgoingConditionListSection';

type Props = {
  nodeConfig: NodeConfig;
  uiConfigSection: NodeDefinitionUIConfigSection;
};

function NodeUiConfigSection(props: Props) {
  const section = props.uiConfigSection;

  switch (section.type) {
    case NodeDefinitionConfigSectionUIType.StartNodeVariables:
    case NodeDefinitionConfigSectionUIType.FinishNodeVariables:
    case NodeDefinitionConfigSectionUIType.InputVariables:
    case NodeDefinitionConfigSectionUIType.OutputVariables:
      return (
        <NodeUiConfigVariablesSection
          nodeConfig={props.nodeConfig}
          type={section.type}
        />
      );
    case NodeDefinitionConfigSectionUIType.OutputConditionList:
      return (
        <NodeUiOutgoingConditionListSection nodeConfig={props.nodeConfig} />
      );
  }
}

export default NodeUiConfigSection;
