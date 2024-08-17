import { FormControl, FormLabel, Option, Select } from '@mui/joy';
import { useAtom, useAtomValue } from 'jotai';

import { NodeKind } from 'canvas-data-base';

import { canvasNodeConfigsAtom } from '../../../states/atoms/canvas-data';
import { canvasSimulatePanelSelectedStartNodeIdAtom } from '../../../states/atoms/canvas-left-side-panel';

function SimulatePanelStartNodeSelector() {
  const nodeConfigs = useAtomValue(canvasNodeConfigsAtom);
  const [selectedNodeId, setSelectedNodeId] = useAtom(
    canvasSimulatePanelSelectedStartNodeIdAtom,
  );

  return (
    <FormControl>
      <FormLabel>Select a start node</FormLabel>
      <Select
        value={selectedNodeId}
        onChange={(_event, value) => {
          setSelectedNodeId(value);
        }}
      >
        {Object.values(nodeConfigs)
          .filter((nodeConfig) => nodeConfig.kind === NodeKind.Start)
          .map((nodeConfig) => (
            <Option key={nodeConfig.nodeId} value={nodeConfig.nodeId}>
              {nodeConfig.name}
            </Option>
          ))}
      </Select>
    </FormControl>
  );
}

export default SimulatePanelStartNodeSelector;
