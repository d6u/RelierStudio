import { type CreateDefaultCanvasDataFunction } from './create-default-canvas-data-function-types';
import {
  type RunNodeFunction,
  type RunNodeObservableFunction,
} from './run-node-function-types';

export type NodeFunctions<TNodeConfig, TNodeParams> = {
  createDefaultCanvasData: CreateDefaultCanvasDataFunction<TNodeConfig>;
} & (
  | { runNode: RunNodeFunction<TNodeParams> }
  | { runNodeObservable: RunNodeObservableFunction<TNodeParams> }
);

export type NodeFunctionsDefault<TNodeConfig, TNodeParams> = {
  createDefaultCanvasData: CreateDefaultCanvasDataFunction<TNodeConfig>;
  runNode?: RunNodeFunction<TNodeParams>;
  runNodeObservable?: RunNodeObservableFunction<TNodeParams>;
};

export * from './create-default-canvas-data-function-types';
export * from './run-node-function-types';
