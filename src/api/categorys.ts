import { get, post, put } from "@/utils/request";

export interface CategoryItem {
  id: number | string;
  img?: string;
  name?: string;
  sort?: number;
  createTime?: string;
}

export interface CategoryParams {
  pageNum?: number;
  pageSize?: number;
}
export interface CategoryResult<T> {
  list: T[];
  total: number;
  pageNum?: number;
  pageSize?: number;
}
// 获取分类/商品列表：路径只写 /getCategories，baseURL 自动拼上 /api
export const getCategories = (data: CategoryParams) =>
  get<CategoryResult<CategoryItem>, CategoryResult<CategoryItem>>(
    "/getCategories",
    {
      params: data,
    },
  );

// 新增商品类型
export const addCategory = (data: CategoryItem) =>
  post<CategoryItem, CategoryItem>("/addCategory", data);

// 编辑商品类型

export const updateCategoryById = (id: string, data: CategoryItem) =>
  put<CategoryItem, CategoryItem>(`/updateCategoryById/${id}`, data);
