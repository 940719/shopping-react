import { post } from "@/utils/request";

// ============ 登录相关接口 ============

export interface LoginParams {
  name: string;
  password: string;
}

// 登录接口返回的 data 结构（与 server 项目 /api/login 一致）
export interface LoginResult {
  token: string;
  id?: number;
  name?: string;
  nickname?: string;
  phone?: string;
  avatar?: string;
  /** 角色数字码：1 超级管理员 / 2 管理员 / 3 普通用户 */
  role?: number;
  createTime?: string;
}

// 登录接口：路径只写 /login，baseURL(/api) 会自动拼上 → 最终请求 /api/login
export const login = (data: LoginParams) =>
  post<LoginResult, LoginResult>("/login", data);
