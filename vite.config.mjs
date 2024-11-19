import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  // depending on your application, base can also be "/"
  base: "",
  plugins: [react(), svgLoader()],
  server: {
    open: false,
    strictPort: true,
    port: 3000,
    host: "localhost",
  },
});
