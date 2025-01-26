import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    })
  ],
  build: {
    minify: true,
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      }
    }
  }
});
