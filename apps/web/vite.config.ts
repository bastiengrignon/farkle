import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import remarkGfm from 'remark-gfm';
import { type AliasOptions, defineConfig } from 'vite';
import compression from 'vite-plugin-compression2';
import { type ManifestOptions, VitePWA } from 'vite-plugin-pwa';

import { fileURLToPath } from 'node:url';

const aliases: AliasOptions = [
  {
    find: '@components',
    replacement: fileURLToPath(new URL('./src/components', import.meta.url)),
  },
  {
    find: '@pages',
    replacement: fileURLToPath(new URL('./src/pages', import.meta.url)),
  },
  {
    find: '@constants',
    replacement: fileURLToPath(new URL('./src/constants', import.meta.url)),
  },
  {
    find: '@store',
    replacement: fileURLToPath(new URL('./src/store', import.meta.url)),
  },
  {
    find: '@hooks',
    replacement: fileURLToPath(new URL('./src/hooks', import.meta.url)),
  },
];

const manifestConfig: Partial<ManifestOptions> = {
  name: 'Farkle Scorekeeper',
  short_name: 'Farkle',
  description: 'A scorekeeper for farkle dice game',
  theme_color: '#339AF0',
  background_color: '#E9ECEF',
  display: 'standalone',
  display_override: ['minimal-ui', 'fullscreen'],
  start_url: '/',
  protocol_handlers: [],
  screenshots: [
    {
      src: '/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      form_factor: 'wide',
    },
    {
      src: '/pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      form_factor: 'narrow',
    },
  ],
  icons: [
    {
      src: '/pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/pwa-maskable-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/pwa-maskable-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};

export default defineConfig({
  plugins: [
    mdx({ providerImportSource: '@mdx-js/react', remarkPlugins: [remarkGfm] }),
    react(),
    VitePWA({
      selfDestroying: true,
      registerType: 'prompt',
      injectRegister: 'auto',
      includeAssets: ['**/*'],
      manifest: manifestConfig,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jsdelivr-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
    compression({
      algorithms: ['gzip', 'brotliCompress'],
    }),
  ],
  resolve: {
    alias: aliases,
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
  build: {
    target: 'esnext',
    rolldownOptions: {
      devtools: {},
      output: {
        codeSplitting: {
          groups: [
            {
              name: (moduleId) => (moduleId.includes('i18next') || moduleId.includes('intl') ? 'i18n' : null),
              minSize: 100 * 1024,
            },
            {
              name: 'react-vendor',
              test: /node_modules[\\/]react/,
              priority: 20,
            },
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
