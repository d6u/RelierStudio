import { atomEffect } from 'jotai-effect';
import { atomWithStorage } from 'jotai/utils';

import type { CanvasConfigKey } from 'canvas-config-definitions';
import {
  NodeConfigFieldType,
  NodeDefinitionConfigSectionKind,
} from 'canvas-data-base';
import { NODE_DEFINITIONS } from 'canvas-data-unified';

import { canvasNodeConfigsAtom } from './canvas-data';

export const canvasConfigsAtom = atomWithStorage<
  { key: CanvasConfigKey; value: string }[]
>('canvasConfigs', [], undefined, {
  getOnInit: true,
});

export const initializeCanvasConfigKeyEffect = atomEffect((get, set) => {
  const nodeConfigs = get(canvasNodeConfigsAtom);
  const canvasConfig = get(canvasConfigsAtom);

  const existingKeys = new Set(canvasConfig.map((config) => config.key));

  Object.values(nodeConfigs).forEach((nodeConfig) => {
    const nodeDef = NODE_DEFINITIONS[nodeConfig.type];

    for (const section of nodeDef.sections) {
      if (section.kind === NodeDefinitionConfigSectionKind.UI) {
        continue;
      }

      const field = nodeConfig.fields[section.key];
      const fieldDef = section.options[field.index];

      if (fieldDef.type !== NodeConfigFieldType.CanvasConfig) {
        continue;
      }

      if (existingKeys.has(fieldDef.canvasConfigKey)) {
        continue;
      }

      existingKeys.add(fieldDef.canvasConfigKey);

      set(canvasConfigsAtom, (prev) => [
        ...prev,
        {
          key: fieldDef.canvasConfigKey,
          value: '',
        },
      ]);
    }
  });
});
