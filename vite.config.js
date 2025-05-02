import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/

export default defineConfig({
  base: "/apps/lisolo/dev/v2",
  server: {
    port: 3000,
  },
  define: { global: "window" },
  plugins: [react()],
});
