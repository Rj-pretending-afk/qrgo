// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isCF = process.env.CF_PAGES === '1'

export default defineConfig({
  plugins: [react()],
  base: isCF ? '/' : '/qrgo/',
})