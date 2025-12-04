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
        allowedHosts: true,
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
          },
        },
      },
      plugins: [react()],
      define: {
        '__GEMINI_API_KEY__': JSON.stringify(env.GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@src': path.resolve(__dirname, './src'),
          '@types': path.resolve(__dirname, './src/types'),
          '@services': path.resolve(__dirname, './src/services'),
          '@hooks': path.resolve(__dirname, './src/hooks'),
          '@context': path.resolve(__dirname, './src/context'),
          '@ui': path.resolve(__dirname, './src/components/ui'),
          '@shared': path.resolve(__dirname, './src/components/shared'),
          '@lib': path.resolve(__dirname, './src/lib'),
          '@assets': path.resolve(__dirname, './attached_assets'),
        }
      },
      css: {
        postcss: './postcss.config.js',
      },
    };
});
