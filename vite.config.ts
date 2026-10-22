import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // 全局注入变量：所有 .less / .module.less 自动可用，无需手动 @import
        additionalData: `@import "@/styles/variables.less";`,
      },
    },
  },
  server: {
    proxy: {
      // 匹配 /api 开头的请求，原样转发到后端（后端路由统一挂 /api 前缀）
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
