import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3003,
  },
  define: {
    'import.meta.env.VITE_OKTA_CLIENT_ID': JSON.stringify(process.env.VITE_OKTA_CLIENT_ID || ''),
    'import.meta.env.VITE_OKTA_ISSUER': JSON.stringify(process.env.VITE_OKTA_ISSUER || ''),
    'import.meta.env.VITE_OKTA_REDIRECT_URI': JSON.stringify(process.env.VITE_OKTA_REDIRECT_URI || ''),
  },
  allowedHosts: [
    'ec2-23-23-79-187.compute-1.amazonaws.com',  // Thay bằng hostname EC2 của bạn
    'ltv.puzzle.sg',
    'www.ltv.puzzle.sg'
  ]
});
