import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/rate_judge/', // GitHub Pages のリポジトリ名に応じて変更
})
