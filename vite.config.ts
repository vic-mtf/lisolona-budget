import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";
import path from "path";

export default defineConfig({
  base: "/apps/lisolo/dev/v2",
  server: {
    port: 3000,
    https: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: { global: "globalThis" },
  plugins: [react(), mkcert()],
});
