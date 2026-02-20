import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // EXE'nin beyaz ekranda kalmasını önleyen kritik ayar
})