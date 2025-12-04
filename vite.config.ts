import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

// Get the directory name equivalent
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  
  // Root points to the client directory
  root: path.resolve(__dirname, "client"),
  
  // Build configuration
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['@tanstack/react-query', 'react-hook-form'],
        },
      },
    },
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    fs: {
      strict: true,
      // Allow serving files from one level up from the package root
      allow: [
        path.resolve(__dirname, '..'),
        path.resolve(__dirname, '..', '..'),
      ],
    },
  },

  // CSS configuration
  css: {
    devSourcemap: true,
  },

  // Optimize deps for faster dev server start
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
