import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Unless the route becomes http://localhost:5173/TouRide2025/
  // base: "/TouRide2025/",
  
  optimizeDeps: {

    exclude: ['lucide-react'],
  },
});
