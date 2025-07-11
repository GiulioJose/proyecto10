import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@js': path.resolve(__dirname, './src/js'),
      '@components': path.resolve(__dirname, './src/js/components'),
      '@views': path.resolve(__dirname, './src/js/views'),
      '@utils': path.resolve(__dirname, './src/js/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
})
