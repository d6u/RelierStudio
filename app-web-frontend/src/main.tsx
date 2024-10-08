import { enablePatches } from 'immer';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from 'ui';

enablePatches();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
