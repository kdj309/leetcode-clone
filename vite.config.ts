import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer() as PluginOption],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/system', '@emotion/react', '@emotion/styled'],
          query: ['@tanstack/react-query'],
          editor: ['@monaco-editor/react'],
        },
      },
    },
  },
});
