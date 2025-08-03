import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/

export default defineConfig({
  base: "/apps/lisolo/dev/v2",
  server: {
    port: 3000,
    https: true,
  },
  define: { global: "window" },
  plugins: [react(), mkcert()],
});
