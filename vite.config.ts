import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    base: '', // relative base path ensures assets load correctly on GitHub Pages
    define: {
      // Shims process.env.API_KEY so it is available in the browser
      // Defaults to empty string to prevent undefined crashes
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ""),
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    }
  };
});