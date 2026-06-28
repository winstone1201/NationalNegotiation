import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  build: {
    target: 'es2015',
    cssTarget: 'chrome61',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vue') || id.includes('node_modules/vue-router') || id.includes('node_modules/pinia')) {
            return 'vendor'
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap'
          }
        }
      }
    },
    // 资源内联阈值（小于此值内联为base64）
    assetsInlineLimit: 4096
  }
})
