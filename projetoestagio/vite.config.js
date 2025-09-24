import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import react from '@vitejs/plugin-react-swc'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    visualizer({ open: true })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  define:{
    'process.env.NODE_ENV' : JSON.stringify('production'),
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
     
    },
  },
})