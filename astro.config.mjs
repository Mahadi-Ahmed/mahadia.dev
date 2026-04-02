import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'

import robotsTxt from 'astro-robots-txt'

const site = process.env.CF_PAGES_URL || 'https://mahadia.dev'
const isPreview = process.env.CF_PAGES_BRANCH !== 'main'

console.log('building for site: ', site)
// https://astro.build/config
export default defineConfig({
  site,
  integrations: [
    react(),
    sitemap(),
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          ...(isPreview
            ? { disallow: '/' }
            : {
                allow: ['/', '/gallery'],
                disallow: ['/components/', '/layouts/', '/styles/']
              })
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
    plugins: [tailwindcss()],
    build: {
      // Enable minification with specific settings
      minify: 'terser',
      terserOptions: {
        // Remove console logs in production
        compress: {
          drop_console: true
        },
        // Improve code output
        format: {
          // Remove comments
          comments: false,
          // Make output more readable if needed
          beautify: false
        },
        // Keep class names for React components
        keep_classnames: true,
        // Keep function names for debugging
        keep_fnames: true
      }
    },
    // Enable build-time optimizations
    optimizeDeps: {
      include: ['react', 'react-dom']
    }
  }
})
