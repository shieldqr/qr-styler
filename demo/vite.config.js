import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'shield-qr-styler': resolve(__dirname, '../src/index.js'),
      // Ensure qrcode resolves from demo's node_modules even when
      // imported by the library source file outside the project root
      'qrcode': resolve(__dirname, 'node_modules/qrcode'),
    },
  },
});
