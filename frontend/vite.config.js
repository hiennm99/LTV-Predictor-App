import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [
    react(),
    wasm()
  ],
  server: {
    host: '0.0.0.0',
    port: 3001,
  }
});
