import type { ButtonProps } from "antd";
import { Button } from "antd";
import React from "react";
import { usePermission } from "@/hooks/usePermission";

export interface AuthButtonProps extends ButtonProps {
  /** 需要的权限码，例如 "user:add" */
  perm: string;
}

// 权限按钮：无权限直接不渲染，等价 Vue 里的 v-permission 指令
const AuthButton: React.FC<AuthButtonProps> = ({ perm, children, ...rest }) => {
  const allowed = usePermission(perm);
  if (!allowed) return null;
  return <Button {...rest}>{children}</Button>;
};

export default AuthButton;
