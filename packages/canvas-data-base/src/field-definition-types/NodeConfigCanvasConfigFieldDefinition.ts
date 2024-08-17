import { type CanvasConfigKey } from 'canvas-config-definitions';

import { type NodeConfigFieldType } from './NodeConfigFieldType';

export type NodeConfigCanvasConfigFieldDefinition<_T = never> = {
  type: NodeConfigFieldType.CanvasConfig;
  canvasConfigKey: CanvasConfigKey;
};

export type NodeConfigCanvasConfigFieldConfig = {};
