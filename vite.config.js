// import { defineConfig } from 'vite';
// import vue from '@vitejs/plugin-vue';

// export default defineConfig({
//   plugins: [vue()],
//   server: {
//     port: 5173,
//     // Saat dev, request /api & /sanctum diteruskan ke Laravel lokal
//     proxy: {
//       '/api':     { target: 'http://127.0.0.1:8000', changeOrigin: true },
//       '/sanctum': { target: 'http://127.0.0.1:8000', changeOrigin: true },
//     },
//   },
// });
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Bug fix: alias '@' ini sebelumnya belum ada sama sekali,
      // padahal seluruh project pakai import '@/shared/...' dkk.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    // Saat dev, request /api & /sanctum diteruskan ke Laravel lokal
    proxy: {
      "/api": { target: "http://rizky-project.io", changeOrigin: true },
      "/sanctum": { target: "http://rizky-project.io", changeOrigin: true },
      "/storage": { target: "http://rizky-project.io", changeOrigin: true },
      // "/api": { target: "http://127.0.0.1:8000", changeOrigin: true },
      // "/sanctum": { target: "http://127.0.0.1:8000", changeOrigin: true },
      // "/storage": { target: "http://127.0.0.1:8000", changeOrigin: true },
    },
  },
});
