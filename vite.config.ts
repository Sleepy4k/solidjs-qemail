import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "logo": ["src/assets/images/logo.png"],
          "vendor-solid": ["solid-js", "@solidjs/router"],
          "vendor-gsap": ["gsap"],
          "vendor-nprogress": ["nprogress", "src/assets/css/nprogress.css"],
        },
      },
    },
    chunkSizeWarningLimit: 75,
  },
});
