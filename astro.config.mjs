import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

import robotsTxt from 'astro-robots-txt';

const site = process.env.CF_PAGES_URL || 'https://mahadia.dev';
const isPreview = site.includes('pages.dev');

console.log('building for site: ', site)
// https://astro.build/config
export default defineConfig({
  site,
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          ...(isPreview
            ? { disallow: '/' }
            : {
              allow: ['/', '/gallery'],
              disallow: [
                '/components/',
                '/layouts/',
                '/styles/'
              ]
            }
          ),
          crawlDelay: 10
        }
      ],
      sitemap: true,
      host: false
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
