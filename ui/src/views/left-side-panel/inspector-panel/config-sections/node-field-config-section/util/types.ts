import type { NodeDefinitionUIConfigSection } from 'canvas-data-base';
import type {
  NODE_DEFINITIONS,
  NodeConfig,
  NodeType,
} from 'canvas-data-unified';

import type { UnionToIntersection } from '../../../../../../util/typing';

export type FieldConfigSection = Exclude<
  {
    [Key in NodeType]: (typeof NODE_DEFINITIONS)[Key];
  }[NodeType]['sections'][number],
  NodeDefinitionUIConfigSection
>;

export type NodeConfigField = UnionToIntersection<NodeConfig['fields']>;

export type NodeConfigFieldKey = keyof NodeConfigField;
