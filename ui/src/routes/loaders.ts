import { type LoaderFunctionArgs } from 'react-router-dom';

import { createNewWorkflowIfNoWorkflow } from '../states/actions/workflow';
import { workflowsAtom } from '../states/atoms/workflows';
import { canvasStore } from '../states/store';
import {
  generatePathForWorkflowEditorRoute,
  parseWorkflowEditorRouteParams,
} from './workflow-editor-route-util';

export async function rootRouteCatchAllLoader() {
  createNewWorkflowIfNoWorkflow();

  const workflows = canvasStore.get(workflowsAtom);
  const workflow = workflows[0];

  return new Response(null, {
    status: 302,
    headers: {
      Location: generatePathForWorkflowEditorRoute(workflow.id),
    },
  });
}

export const workflowEditorRouteLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  const workflows = canvasStore.get(workflowsAtom);

  const { workflowId } = parseWorkflowEditorRouteParams(params);

  const workflow = workflows.find((workflow) => workflow.id === workflowId);

  if (workflow == null) {
    return await rootRouteCatchAllLoader();
  }

  return null;
};
