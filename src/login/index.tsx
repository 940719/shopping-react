import { ShopTwoTone, LockOutlined, UserOutlined } from "@ant-design/icons";
import type { FormProps } from "antd";
import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { login, type LoginParams } from "@/api/login";
import { setToken, setUserInfo } from "@/utils/auth";
import styles from "./Login.module.less";
type FieldType = {
  name?: string;
  password?: string;
};
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);
    try {
      const data = await login(values as LoginParams);
      // 登录成功：保存 token 和用户信息（含角色、权限码，路由拦截要用）
      setToken(data.token);
      setUserInfo(data.userInfo);
      message.success("登录成功");
      navigate("/"); // index 路由会自动重定向到 /users
    } catch {
      // 错误提示已在 request 拦截器统一处理
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>
            <ShopTwoTone />
            <span className={styles.logoText}>优选商城 · 管理后台</span>
          </div>
          <div className={styles.loginTitle}>账号登录</div>
          <div className={styles.loginSub}>请输入管理员账号与密码</div>

          <Form
            name="basic"
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {" "}
            <Form.Item<FieldType>
              name="name"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
                autoComplete="username"
              />
            </Form.Item>
            <Form.Item<FieldType>
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                autoComplete="current-password"
              />
            </Form.Item>
            <Form.Item label={null}>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.loginBtn}
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
          <div className={styles.loginTip}>账号示例：admin / 123456</div>
        </div>
      </div>
    </>
  );
};

export default Login;
