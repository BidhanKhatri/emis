import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/proxy': {
        target: 'http://10.5.15.11:8000',  // Backend server address
        changeOrigin: true,  // Change the origin of the host header to the target URL
        rewrite: (path) => path.replace(/^\/proxy/, '')  // Remove /proxy from the request URL
      }
    }
  },
})
