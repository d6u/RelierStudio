import { produce } from 'immer';
import { type NavigateFunction } from 'react-router-dom';
import invariant from 'tiny-invariant';

import randomId from 'common-utils/randomId';

import { generatePathForWorkflowEditorRoute } from '../../routes/workflow-editor-route-util';
import { canvasUiLeftMenuBarOpenAtom } from '../atoms/canvas-ui';
import {
  type Workflow,
  currentWorkflowIdAtom,
  workflowsAtom,
} from '../atoms/workflows';
import { canvasStore } from '../store';
import {
  generateStorageKeyForCanvasData,
  generateStorageKeyForCanvasRunData,
} from '../util/generate-storage-key';
import { getAvailableWorkflowName } from '../util/get-available-util';

export function createFlow(navigate: NavigateFunction) {
  const workflows = canvasStore.get(workflowsAtom);

  const newWorkflow = {
    id: randomId(),
    name: getAvailableWorkflowName('New workflow'),
    updatedAt: Date.now(),
    createdAt: Date.now(),
  };

  canvasStore.set(workflowsAtom, [...workflows, newWorkflow]);

  navigate(generatePathForWorkflowEditorRoute(newWorkflow.id));

  canvasStore.set(canvasUiLeftMenuBarOpenAtom, false);
}

export function deleteFlow(navigate: NavigateFunction) {
  const workflowId = canvasStore.get(currentWorkflowIdAtom);

  invariant(workflowId != null, 'Workflow ID should not be null');

  let workflows = canvasStore.get(workflowsAtom);

  const index = workflows.findIndex((workflow) => workflow.id === workflowId);

  workflows = produce(workflows, (draft) => {
    draft.splice(index, 1);
  });

  canvasStore.set(workflowsAtom, workflows);

  createNewWorkflowIfNoWorkflow();

  workflows = canvasStore.get(workflowsAtom);

  navigate(generatePathForWorkflowEditorRoute(workflowId));

  localStorage.removeItem(generateStorageKeyForCanvasData(workflowId));
  localStorage.removeItem(generateStorageKeyForCanvasRunData(workflowId));
}

export function createNewWorkflowIfNoWorkflow() {
  const workflows = canvasStore.get(workflowsAtom);

  if (workflows.length === 0) {
    const workflow: Workflow = {
      id: randomId(),
      name: getAvailableWorkflowName('New workflow'),
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };

    canvasStore.set(workflowsAtom, [workflow]);
  }
}
