import { type Params, generatePath, useParams } from 'react-router-dom';

import { ROOT_PATH } from './root-route-util';

export const WORKFLOW_EDITOR_ROUTE_SUB_PATH = 'workflows/:workflowId';

type WorkflowEditorRouteParams = {
  workflowId: string;
};

export function generatePathForWorkflowEditorRoute(workflowId: string) {
  const params: WorkflowEditorRouteParams = {
    workflowId: workflowId,
  };

  return generatePath(ROOT_PATH + WORKFLOW_EDITOR_ROUTE_SUB_PATH, params);
}

export function useWorkflowEditorRouteParams(): WorkflowEditorRouteParams {
  return useParams() as WorkflowEditorRouteParams;
}

export function parseWorkflowEditorRouteParams(
  params: Params,
): WorkflowEditorRouteParams {
  return params as WorkflowEditorRouteParams;
}
