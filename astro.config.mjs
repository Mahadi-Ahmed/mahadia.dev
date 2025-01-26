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
    // Enable minification for all assets
    minify: true,
    // Inline small CSS files directly into HTML
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      // Enable minification with specific settings
      minify: 'terser',
      terserOptions: {
        // Remove console logs in production
        compress: {
          drop_console: true,
        },
        // Improve code output
        format: {
          // Remove comments
          comments: false,
          // Make output more readable if needed
          beautify: false,
        },
        // Keep class names for React components
        keep_classnames: true,
        // Keep function names for debugging
        keep_fnames: true
      },
      // Split code into smaller chunks
      rollupOptions: {
        output: {
          manualChunks: {
            // Group React-related code
            react: ['react', 'react-dom'],
            // Group UI components
            components: ['/src/components']
          }
        }
      }
    },
    // Enable build-time optimizations
    optimizeDeps: {
      include: ['react', 'react-dom']
    }
  }
});
