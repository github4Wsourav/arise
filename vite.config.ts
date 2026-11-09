/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['assets/characters/tiers.json'],
      manifest: {
        name: 'Arise - Solo Leveling Fitness RPG',
        short_name: 'Arise',
        description: 'The System has chosen you. A fitness RPG powered by real training.',
        start_url: './',
        scope: './',
        theme_color: '#07090E',
        background_color: '#07090E',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2,ttf,json}'],
        runtimeCaching: [
          {
            // character art is dropped in over time — cache-first, long-lived
            urlPattern: /\/assets\/characters\/.*\.webp$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'character-art',
              expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            // world/UI art (backgrounds, gates, fx, relics) — too big to precache,
            // but cache on first view so the app is fully offline and snappy
            urlPattern: /\/assets\/.*\.webp$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'world-art',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 180 },
            },
          },
          {
            // looping exercise demo clips (local public/assets/demos or a remote bucket).
            // rangeRequests handles the 206 partial requests <video> makes, so a clip is
            // streamed once then served from cache — no re-download per set, works offline.
            urlPattern: /\.(?:mp4|webm)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'exercise-demos',
              rangeRequests: true,
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 180 },
            },
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/engine/**/*.ts'],
      thresholds: { lines: 90, functions: 90, branches: 85, statements: 90 },
    },
  },
});
