import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/TouRide2025",
  optimizeDeps: {

    exclude: ['lucide-react'],
  },
});
