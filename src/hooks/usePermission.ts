import { getPerms } from "@/utils/auth";

// 按钮权限判断：返回当前用户是否拥有该权限码
// 登录态变化会导致路由跳转、组件重新挂载，直接读 localStorage 即可
export function usePermission(perm: string): boolean {
  return getPerms().includes(perm);
}
