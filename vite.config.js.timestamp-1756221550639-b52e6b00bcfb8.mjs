// vite.config.js
import { defineConfig } from "file:///home/vic/Apps/geid-projets/geid-lisolo/node_modules/.pnpm/vite@5.4.19_@types+node@24.3.0_terser@5.43.1/node_modules/vite/dist/node/index.js";
import react from "file:///home/vic/Apps/geid-projets/geid-lisolo/node_modules/.pnpm/@vitejs+plugin-react-swc@3.11.0_vite@5.4.19_@types+node@24.3.0_terser@5.43.1_/node_modules/@vitejs/plugin-react-swc/index.js";
import mkcert from "file:///home/vic/Apps/geid-projets/geid-lisolo/node_modules/.pnpm/vite-plugin-mkcert@1.17.8_vite@5.4.19_@types+node@24.3.0_terser@5.43.1_/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
var vite_config_default = defineConfig({
  base: "/apps/lisolo/dev/v2",
  server: {
    port: 3e3,
    https: true
  },
  define: { global: "globalThis" },
  plugins: [react(), mkcert()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS92aWMvQXBwcy9nZWlkLXByb2pldHMvZ2VpZC1saXNvbG9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3ZpYy9BcHBzL2dlaWQtcHJvamV0cy9nZWlkLWxpc29sby92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS92aWMvQXBwcy9nZWlkLXByb2pldHMvZ2VpZC1saXNvbG8vdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBta2NlcnQgZnJvbSBcInZpdGUtcGx1Z2luLW1rY2VydFwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiBcIi9hcHBzL2xpc29sby9kZXYvdjJcIixcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMzAwMCxcbiAgICBodHRwczogdHJ1ZSxcbiAgfSxcbiAgZGVmaW5lOiB7IGdsb2JhbDogXCJnbG9iYWxUaGlzXCIgfSxcbiAgcGx1Z2luczogW3JlYWN0KCksIG1rY2VydCgpXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1UyxTQUFTLG9CQUFvQjtBQUNwVSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBRW5CLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxRQUFRLEVBQUUsUUFBUSxhQUFhO0FBQUEsRUFDL0IsU0FBUyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFDN0IsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
