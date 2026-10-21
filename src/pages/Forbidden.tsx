import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router";

// 403：登录了但权限不足
const Forbidden: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，你暂无权限访问该页面"
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          返回首页
        </Button>
      }
    />
  );
};
export default Forbidden;
