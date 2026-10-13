import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL ?? process.env.PUBLIC_URL ?? '/',
  plugins: [react()],
})
