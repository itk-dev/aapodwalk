import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  // depending on your application, base can also be "/"
  // @TODO pass allowed hosts via __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS through container in .env
  base: "/",
  plugins: [react(), svgLoader()],
  server: {
    allowedHosts: [
        // Development domain
        ".local.itkdev.dk",
        // Production domain
        "podwalk.itkdev.dk"
    ],
    open: false,
    strictPort: true,
    port: 3000,
    host: "localhost",
  },
});
