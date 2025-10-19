import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { Link } from "react-router-dom";
import api from "../api/api";

const { Title, Text } = Typography;

export default function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
  setLoading(true);
  try {
    const res = await api.get("/users", {
      params: {
        username: values.username,
        password: values.password,
      },
    });

    if (res.data.length === 0) {
      message.error("Username atau password salah");
      setLoading(false);
      return;
    }

    const user = res.data[0];
    message.success(`Selamat datang, ${user.name}!`);

    // Simpan user dan panggil handler dari App
    localStorage.setItem("user", JSON.stringify(user));
    if (typeof onLogin === "function") onLogin(user);
  } catch (err) {
    message.error("Terjadi kesalahan saat login");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e6f7ff, #ffffff)",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 380,
          borderRadius: 16,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: 30 }}
      >
        <Title level={3} style={{ textAlign: "center", color: "#1890ff" }}>
          Login
        </Title>

        <Form layout="vertical" form={form} onFinish={handleLogin}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Masukkan username Anda" }]}
          >
            <Input placeholder="Masukkan username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Masukkan password Anda" }]}
          >
            <Input.Password placeholder="Masukkan password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{ borderRadius: 8, marginTop: 8 }}
          >
            Masuk
          </Button>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Text>Belum punya akun?</Text>
          <br />
          <Link to="/register">
            <Button type="link" style={{ padding: 0 }}>
              Buat Akun Baru
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
