import React, { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import {
  LaptopOutlined,
  NotificationOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { routes } from "@/router";
import type { AppRoute } from "@/router/types";
import { getPerms, hasAnyPerm } from "@/utils/auth";
const { Header, Content, Sider } = Layout;

// 路由 meta.icon（字符串）→ antd 图标 的映射表，新增菜单时在这里加一行
const iconMap: Record<string, React.ReactNode> = {
  dashboard: <LaptopOutlined />,
  user: <UserOutlined />,
  goods: <ShoppingOutlined />,
  order: <NotificationOutlined />,
};

const MyLayout: React.FC = () => {
  // Layout 的子路由 = 侧边栏菜单的数据源
  const layoutChildren: AppRoute[] =
    (routes.find((r) => r.path === "/")?.children as AppRoute[] | undefined) ??
    [];
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 当前选中的菜单 key：/users → /users
  const currentPath = "/" + (pathname.split("/")[1] ?? "");

  // 由路由表生成侧边栏菜单：过滤无标题/无权限的路由
  const menuItems: MenuProps["items"] = useMemo(() => {
    // 当前用户的权限码（后端没返回权限时为空数组 → 菜单全部显示）
    const perms = getPerms();

    return layoutChildren
      .filter((r) => !r.index && r.meta?.title)
      .filter((r) => {
        // 权限过滤：后端没返回权限数据（perms 为空）时不拦截，菜单全部显示
        if (!r.meta?.perms?.length) return true;
        if (perms.length === 0) return true;
        return hasAnyPerm(r.meta.perms);
      })
      .map((r) => ({
        key: `/${r.path}`,
        icon: r.meta?.icon ? iconMap[r.meta.icon] : undefined,
        label: r.meta?.title,
      }));
  }, []);

  // 当前页面标题（用于面包屑）：从路由表里反查
  const currentTitle =
    layoutChildren.find((r) => `/${r.path}` === currentPath)?.meta?.title ??
    "首页";

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          color: "#fff",
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        优选商城 · 管理后台
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            selectedKeys={currentPath ? [currentPath] : []}
            style={{ height: "100%", borderInlineEnd: 0 }}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb
            items={[{ title: currentTitle }]}
            style={{ margin: "16px 0" }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* 子路由页面渲染在这里 */}
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default MyLayout;
