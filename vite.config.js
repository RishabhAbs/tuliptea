import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

function injectSwVersion() {
  return {
    name: 'inject-sw-version',
    closeBundle() {
      const swPath = resolve(__dirname, 'dist/service-worker.js');
      try {
        const version = `tuliptea-${Date.now()}`;
        let code = readFileSync(swPath, 'utf-8');
        code = code.replace(
          "self.__BUILD_VERSION__ || 'tuliptea-' + Date.now()",
          `'${version}'`
        );
        writeFileSync(swPath, code);
      } catch {
        // In dev mode dist/ doesn't exist — ignore
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), injectSwVersion()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
