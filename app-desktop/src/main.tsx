import { enablePatches } from 'immer';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from 'ui';

enablePatches();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App useHashRouter />
  </StrictMode>,
);

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
