import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Spin,
  Tag,
  Row,
  Col,
  Empty,
  Button,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  WalletOutlined,
  CalendarOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import api from "../api/api";

const { Text, Title } = Typography;

export default function Transactions({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil data transaksi dari server
  const fetchTx = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transactions", {
        params: { userId: user?.id },
      });
      const txs = await Promise.all(
        res.data.map(async (t) => {
          const pkg = (await api.get(`/packages/${t.packageId}`)).data;
          return {
            ...t,
            packageName: pkg.name,
            price: pkg.price,
          };
        })
      );
      setTransactions(txs);
    } catch (err) {
      console.error(err);
      message.error("Gagal memuat data transaksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTx();
  }, [user]);

  // 🔹 Fungsi untuk konfirmasi pembayaran
  const handleConfirm = async (id) => {
    try {
      await api.patch(`/transactions/${id}`, { status: "success" });
      message.success("Pembayaran dikonfirmasi!");
      fetchTx();
    } catch {
      message.error("Gagal konfirmasi pembayaran");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );

  if (!transactions.length)
    return <Empty description="Belum ada transaksi" style={{ marginTop: 60 }} />;

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #f7faff 0%, #ffffff 100%)",
        minHeight: "100vh",
        padding: "30px 16px 60px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <Title level={3} style={{ color: "#1890ff", marginBottom: 8 }}>
          Riwayat Transaksi
        </Title>
        <Text type="secondary">
          Cek status pembelian paket data kamu di sini 📱
        </Text>
      </div>

      {/* Daftar Transaksi */}
      <Row gutter={[16, 16]}>
        {transactions.map((t) => (
          <Col xs={24} sm={12} md={8} lg={6} key={t.id}>
            <Card
              hoverable
              style={{
                borderRadius: 16,
                background: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease",
              }}
              bodyStyle={{ padding: "18px 20px" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Header Paket */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text strong style={{ fontSize: 16 }}>
                  {t.packageName}
                </Text>

                <Tag
                  color={t.status === "success" ? "green" : "orange"}
                  icon={
                    t.status === "success" ? (
                      <CheckCircleOutlined />
                    ) : (
                      <ClockCircleOutlined />
                    )
                  }
                >
                  {t.status?.toUpperCase() || "PENDING"}
                </Tag>
              </div>

              {/* Info Detail */}
              <div style={{ marginTop: 10 }}>
                <Text type="secondary">
                  <PhoneOutlined /> Nomor:
                </Text>
                <br />
                <Text strong>{t.phone}</Text>
                <br />
                <Text type="secondary" style={{ marginTop: 8, display: "block" }}>
                  <WalletOutlined /> Metode: {t.paymentMethod || "-"}
                </Text>
                <Text type="secondary" style={{ display: "block" }}>
                  <CalendarOutlined />{" "}
                  {new Date(t.date).toLocaleString("id-ID")}
                </Text>
              </div>

              {/* Total */}
              <div
                style={{
                  marginTop: 12,
                  borderTop: "1px dashed #e5e5e5",
                  paddingTop: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text strong>Total</Text>
                <Text strong style={{ color: "#1890ff", fontSize: 15 }}>
                  Rp {t.price.toLocaleString("id-ID")}
                </Text>
              </div>

              {/* Tombol Konfirmasi */}
              {t.status === "pending" && (
                <Button
                  type="primary"
                  block
                  size="small"
                  style={{
                    marginTop: 14,
                    borderRadius: 8,
                    backgroundColor: "#1890ff",
                    boxShadow: "0 3px 8px rgba(24,144,255,0.3)",
                  }}
                  onClick={() => handleConfirm(t.id)}
                >
                  Konfirmasi Pembayaran
                </Button>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
