import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const hmrConfig = process.env.REPLIT_DEV_DOMAIN 
      ? {
          protocol: 'wss',
          host: process.env.REPLIT_DEV_DOMAIN,
          clientPort: 443,
        }
      : true;
    
    return {
      server: {
        port: 5000,
        host: '0.0.0.0',
        hmr: hmrConfig,
      },
      plugins: [react()],
      define: {
        '__GEMINI_API_KEY__': JSON.stringify(env.GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
