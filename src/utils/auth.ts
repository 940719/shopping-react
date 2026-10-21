// ============ 登录态与权限工具（localStorage 持久化） ============

export interface UserInfo {
  username: string;
  roles: string[];
  perms: string[];
}

const TOKEN_KEY = "token";
const USER_KEY = "userInfo";

// ---------- token ----------
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);

// ---------- 用户信息（含角色、权限码） ----------
export const getUserInfo = (): UserInfo | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserInfo;
  } catch {
    return null;
  }
};
export const setUserInfo = (info: UserInfo) =>
  localStorage.setItem(USER_KEY, JSON.stringify(info));

// ---------- 权限判断 ----------
// 当前用户拥有的权限码列表
export const getPerms = (): string[] => getUserInfo()?.perms ?? [];

// 拥有任一权限（路由 meta.perms 命中一个即可）
export const hasAnyPerm = (needed: string[]): boolean =>
  needed.some((p) => getPerms().includes(p));

// 拥有全部权限（按钮级判断一般用这个）
export const hasAllPerm = (needed: string[]): boolean =>
  needed.every((p) => getPerms().includes(p));

// ---------- 退出登录 ----------
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
