import { defineConfig } from 'vite'
import tsconfig_paths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [react(), tsconfig_paths({'projects': ['../tsconfig.json', './tsconfig.build.json']})],
  resolve: {
    alias: {
      assets: '../assets'
    }
  },
  server: {
    port: 8080,
  },
  build: {
    outDir: '../dist'
  }
})