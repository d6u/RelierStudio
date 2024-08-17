import { enablePatches } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';

enablePatches();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
