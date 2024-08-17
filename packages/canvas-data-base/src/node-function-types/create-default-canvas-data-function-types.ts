import type { Connector } from '../connector/connector-schema-and-types';

export interface CreateDefaultCanvasDataContext {
  generateNodeId(): string;
  generateConnectorId(): string;
  getAvailableVariableName(prefix: string): string;
  getAvailableNodeName(prefix: string): string;
}

export type CreateDefaultCanvasDataFunction<TNodeConfig> = (
  context: CreateDefaultCanvasDataContext,
) => {
  nodeConfigs: TNodeConfig[];
  connectors: Connector[];
};
