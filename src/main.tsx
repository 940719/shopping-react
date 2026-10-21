import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 路由器本体：全局唯一，装在最顶层 */}
    <RouterProvider router={router} />
  </StrictMode>,
);
