import { VitePWA } from 'vite-plugin-pwa';
export default VitePWA({
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts',
  base: "/",
  injectManifest: {
    maximumFileSizeToCacheInBytes: 3000000
  },
  workbox: {
    cleanupOutdatedCaches: true,
  },
  registerType: 'autoUpdate',
  includeAssets: [
    'pwa/**.{png,svg}'
  ],
  manifest: {
    name: 'RefrainMusic',
    short_name: 'RefrainMusic',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    icons: [
      {
        "src": "/pwa/android-chrome-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/pwa/android-chrome-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ],
    display: 'standalone',
    description: 'A high appearance level music player based on netease Cloud API!',
  },
})