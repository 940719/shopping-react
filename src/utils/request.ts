import axios, { type AxiosRequestConfig } from "axios";
import { message } from "antd";

// ============ axios 统一封装（和 Vue 项目里 request.js 思路一致） ============

// 创建 axios 实例：baseURL、超时等全局配置
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
});

// 请求拦截器：每次发请求自动带上 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器：统一解包 + 统一错误处理
request.interceptors.response.use(
  (response) => {
    // 约定后端统一返回 { code, data, msg }，code === 200 表示成功（与 server 项目一致）
    const res = response.data;
    if (res.code === 401) {
      message.error("登录已过期，请重新登录");
      localStorage.removeItem("token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(new Error(res.msg || "登录已过期，请重新登录"));
    }
    if (res.code !== 200) {
      message.error(res.msg || "请求失败");
      return Promise.reject(new Error(res.msg || "请求失败"));
    }
    // 直接把业务数据 data 返回，调用处不用再 res.data.data
    return res.data;
  },
  (error) => {
    // HTTP 层错误统一处理
    if (error.response?.status === 401) {
      message.error("登录已过期，请重新登录");
      localStorage.removeItem("token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else {
      message.error(
        error.response?.data?.message || error.message || "网络错误",
      );
    }
    return Promise.reject(error);
  },
);

// ============ 统一导出方法（和 Vue 项目 request.js 的写法一致） ============
// 用法：import { get, post, put, del } from "@/utils/request";
// 泛型 T 是后端返回 data 的类型，R 是整体返回类型，默认等于 T

export const get = <T = unknown, R = T>(
  url: string,
  config?: AxiosRequestConfig,
) => request.get<T, R>(url, config);

export const post = <T = unknown, R = T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) => request.post<T, R>(url, data, config);

export const put = <T = unknown, R = T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) => request.put<T, R>(url, data, config);

export const del = <T = unknown, R = T>(
  url: string,
  config?: AxiosRequestConfig,
) => request.delete<T, R>(url, config);

export default request;
