// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import api from '../api/api';

export default function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await api.get('/users', { params: { username: values.username, password: values.password }});
      if (res.data && res.data.length > 0) {
        onLogin(res.data[0]);
        message.success('Login berhasil');
      } else {
        message.error('Username atau password salah');
      }
    } catch (err) {
      message.error('Gagal menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
      <Card title="Login - E-Data Market" style={{ width: 380 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item label="Username" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block htmlType="submit" loading={loading}>Login</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
