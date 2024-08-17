import { useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';

import { canvasDataEffect } from '../states/atoms/canvas-data';
import { canvasRunDataRecordsEffect } from '../states/atoms/canvas-run-data';
import { currentWorkflowIdAtom } from '../states/atoms/workflows';
import WorkflowEditor from '../views/workflow-editor/WorkflowEditor';
import { useWorkflowEditorRouteParams } from './workflow-editor-route-util';

function WorkflowEditorRoute() {
  useAtom(canvasDataEffect);
  useAtom(canvasRunDataRecordsEffect);

  const { workflowId } = useWorkflowEditorRouteParams();

  const setCurrentFlowId = useSetAtom(currentWorkflowIdAtom);

  useEffect(() => {
    setCurrentFlowId(workflowId);
  }, [setCurrentFlowId, workflowId]);

  return (
    <ReactFlowProvider>
      <WorkflowEditor />
    </ReactFlowProvider>
  );
}

export default WorkflowEditorRoute;
