import request from "@/utils/request";

// ============ 登录相关接口 ============

export interface LoginParams {
  name: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

// 登录接口（接口路径按你后端的实际路由来改）
export const login = (data: LoginParams) =>
  request.post<LoginResult, LoginResult>("/api/login", data);
