import { createElement } from "react";
import { createBrowserRouter, Navigate, redirect } from "react-router";
import type { AppRoute } from "./types";
import Layout from "@/layout";
import Login from "@/login";
import Users from "@/pages/users";
import Forbidden from "@/pages/Forbidden";
import NotFound from "@/pages/NotFound";
// hasAnyPerm
import { getToken } from "@/utils/auth";

// 鉴权 loader 工厂：每个路由用 meta 声明需要的权限，进入前统一拦截
// （对应 Vue 里的 router.beforeEach 全局守卫）
const authLoader =
  (meta?: { requireAuth?: boolean; perms?: string[] }) => async () => {
    // 第 1 道：未登录 → 踢去登录页
    if (meta?.requireAuth !== false && !getToken()) {
      return redirect("/login");
    }
    // 第 2 道：已登录但缺少权限码 → 踢去 403
    // if (meta?.perms?.length && !hasAnyPerm(meta.perms)) {
    //   return redirect("/403");
    // }
    return null;
  };

export const routes: AppRoute[] = [
  {
    path: "/login",
    element: createElement(Login),
    meta: { title: "登录", requireAuth: false },
  },
  {
    path: "/",
    loader: authLoader({ requireAuth: true }),
    element: createElement(Layout),
    meta: { title: "首页", requireAuth: true },
    children: [
      // 访问 "/" 默认重定向到用户管理页（replace 避免后退又回到 /）
      {
        index: true,
        element: createElement(Navigate, { to: "/users", replace: true }),
      },
      {
        path: "users",
        element: createElement(Users),
        loader: authLoader({ perms: ["user"] }),
        meta: { title: "用户管理", requireAuth: true, perms: ["user"] },
      },
    ],
  },
  {
    path: "/403",
    element: createElement(Forbidden),
    meta: { title: "无权限", requireAuth: false },
  },
  {
    path: "*",
    element: createElement(NotFound),
    meta: { title: "页面不存在", requireAuth: false },
  },
];

const router = createBrowserRouter(routes);

export default router;
