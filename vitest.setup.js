import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Permite usar 'describe', 'it', 'expect' sin importarlos
    environment: 'jsdom', // Simula un navegador
    setupFiles: './src/setupTests.js', // Archivo de configuración inicial
  },
});