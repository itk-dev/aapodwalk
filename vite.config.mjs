import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // depending on your application, base can also be "/"
  base: "",
  plugins: [react()],
  server: {
    open: false,
    strictPort: true,
    port: 3000,
    host: "localhost",
  },
});
