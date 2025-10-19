import React from "react";
import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function CustomerMenu({ user, onLogout }) {
  if (!user) return <Link to="/login"><Button>Login</Button></Link>;

  const menu = (
    <Menu>
      <Menu.Item key="1"><Link to="/dashboard">Dashboard</Link></Menu.Item>
      <Menu.Item key="2"><Link to="/transactions">Riwayat Transaksi</Link></Menu.Item>

      {}
      {user.role === "admin" && (
        <Menu.Item key="3"><Link to="/packages">Kelola Paket</Link></Menu.Item>
      )}

      <Menu.Item key="4" onClick={onLogout}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Button>
        {user.name} <DownOutlined />
      </Button>
    </Dropdown>
  );
}
