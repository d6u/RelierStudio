import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
  ],
  resolve: {
    // match with local packages' conditional "exports",
    // so we can load up .ts files directly without compile packages
    conditions: ['ts'],
  },
});
