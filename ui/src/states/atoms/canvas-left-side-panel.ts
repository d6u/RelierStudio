import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

export enum LeftSidePanelType {
  AddNode = 'AddNode',
  Inspector = 'Inspector',
  Simulate = 'Simulate',
  CavnasConfig = 'CavnasConfig',
  RunHistories = 'RunHistories',
}

export const canvasLeftSidePanelTypeAtom = atom<LeftSidePanelType>(
  LeftSidePanelType.AddNode,
);
export const canvasLeftSidePanelExpandedAtom = atom<boolean>(false);

/**
 * Inspector panel
 */

export const canvasInspectorSelectedNodeIdAtom = atom<string | null>(null);

/**
 * Simulate panel
 */

export const canvasSimulatePanelSelectedStartNodeIdAtom = atom<string | null>(
  null,
);

export const canvasSimulatePanelInputValuesAtom = atom<Record<string, string>>(
  {},
);

/**
 * Canvas config panel
 */

export const canvasConfigFocusInputKeyAtom = atomWithReset<string | null>(null);

/**
 * Histories panel
 */

export const historySelectedHistoryIdAtom = atom<string | null>(null);
