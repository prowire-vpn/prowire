import { defineConfig } from 'vite'
import tsconfig_paths from 'vite-tsconfig-paths'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [tsconfig_paths()],
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