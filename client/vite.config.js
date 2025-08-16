import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // เมื่อ Client เรียก path ที่ขึ้นต้นด้วย /api
      // ให้ Vite ส่ง request นั้นต่อไปที่ http://localhost:5000
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})
