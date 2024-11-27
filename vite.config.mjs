import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  base: "/",
  plugins: [react(), svgLoader()],
  server: {
    strictPort: true,
    port: 3000,
    host: "localhost",
    hmr: {
      host: "aapodwalk.local.itkdev.dk",
      protocol: "wss",
      clientPort: 443,
      path: "/ws",
    },
  },
});
