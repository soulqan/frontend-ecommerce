import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  //registrasi
  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const existing = await api.get("/users", {
        params: { username: values.username },
      });

      if (existing.data.length > 0) {
        message.warning("Username sudah digunakan, coba yang lain.");
        setLoading(false);
        return;
      }

      const newUser = {
        username: values.username,
        password: values.password,
        name: values.name,
        role: "customer",
      };

      await api.post("/users", newUser);
      message.success("Registrasi berhasil! Silakan login.");

      form.resetFields();
      navigate("../");
    } catch (error) {
      console.error(error);
      message.error("Gagal melakukan registrasi, coba lagi nanti.");
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
        <Title
          level={3}
          style={{
            textAlign: "center",
            color: "#1890ff",
            marginBottom: 24,
          }}
        >
          Daftar Akun Baru
        </Title>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleRegister}
          autoComplete="off"
        >
          <Form.Item
            label="Nama Lengkap"
            name="name"
            rules={[{ required: true, message: "Masukkan nama lengkap Anda" }]}
          >
            <Input placeholder="Contoh: Budi Setiawan" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Masukkan username" },
              { min: 4, message: "Minimal 4 karakter" },
            ]}
          >
            <Input placeholder="Username Anda" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Masukkan password" },
              { min: 4, message: "Minimal 4 karakter" },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              borderRadius: 8,
              marginTop: 10,
              boxShadow: "0 3px 8px rgba(24,144,255,0.3)",
            }}
          >
            Daftar Sekarang
          </Button>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Text>
            Sudah punya akun?{" "}
            <Link to="/" style={{ color: "#1890ff" }}>
              Masuk di sini
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}
