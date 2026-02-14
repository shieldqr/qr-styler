import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'shield-qr-styler': resolve(__dirname, '../src/index.js'),
    },
  },
});
