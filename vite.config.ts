import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'IDEF1GoJS',
      fileName: (format) => `idef-gojs.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      // GoJS can be bundled or externalized. Usually for standalone use it's helpful to either peer or externalize.
      // We keep gojs external in library builds so host applications can control the GoJS version and license.
      external: ['gojs'],
      output: {
        globals: {
          gojs: 'go',
        },
      },
    },
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: false,
  },
});
