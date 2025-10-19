// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import CustomerMenu from './components/CustomerMenu';
import AdminPackages from "./pages/AdminPackages";


const { Header, Content } = Layout;

export default function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontWeight: 'bold' }}>Paket data</div>
        <CustomerMenu user={user} onLogout={handleLogout}/>
      </Header>
      <Content style={{ padding: 24 }}>
       <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/transactions" element={<Transactions user={user} />} />
          <Route
            path="/admin/packages"
            element={
              user?.role === "admin"
                ? <AdminPackages />
                : <div style={{ textAlign: "center", marginTop: 100 }}>
                    <h2>Akses ditolak 🔒</h2>
                    <p>Hanya admin yang dapat membuka halaman ini.</p>
                  </div>
            }
          />
        </Routes>
      </Content>
    </Layout>
  );
}
