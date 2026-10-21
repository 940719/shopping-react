import type { RouteObject } from "react-router";

// 自定义路由元信息
export interface RouteMeta {
  title?: string;
  requireAuth?: boolean;
  icon?: string;
  /** 访问该路由需要的权限码（任一个命中即可），例如 ["user"] 或 ["user:list"] */
  perms?: string[];
}

// 扩展官方 RouteObject
export type AppRoute = RouteObject & {
  meta?: RouteMeta;
  children?: AppRoute[];
};
