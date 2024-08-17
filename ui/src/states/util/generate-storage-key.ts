export function generateStorageKeyForCanvasData(flowId: string) {
  return `${flowId}-canvasData`;
}

export function generateStorageKeyForCanvasRunData(workflowId: string) {
  return `${workflowId}-canvasRunData`;
}
