import React, { useState, useEffect } from "react";
import api from "../api/api";
import {
  Typography,
  Spin,
  Card,
  Row,
  Col,
  Button,
  Tag,
  Empty,
} from "antd";
import {
  WifiOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import PurchaseForm from "../components/Purchaseform";

const { Title, Text } = Typography;

export default function Dashboard({ user }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await api.get("/packages");
        setPackages(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleBuy = (pkg) => {
    setSelectedPkg(pkg);
    setVisible(true);
  };

  const handleSuccess = (tx) => {
    console.log("transaction", tx);
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #f7faff 0%, #ffffff 100%)",
        minHeight: "100vh",
        padding: "30px 20px 80px 20px",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <Title level={2} style={{ color: "#1890ff", marginBottom: 8 }}>
          Halo{user ? `, ${user.name}` : ""}! 👋
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Pilih paket data terbaik untuk kebutuhan internetmu 🚀
        </Text>
      </div>

      {/* Daftar Paket */}
      {packages.length === 0 ? (
        <Empty description="Belum ada paket tersedia" />
      ) : (
        <Row gutter={[20, 20]} justify="center">
          {packages.map((pkg) => (
            <Col xs={24} sm={12} md={8} lg={6} key={pkg.id}>
              <Card
                hoverable
                bordered={false}
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  background: "#fff",
                }}
                bodyStyle={{ padding: 20 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.08)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Text strong style={{ fontSize: 16 }}>
                    {pkg.name}
                  </Text>
                  <WifiOutlined style={{ color: "#1890ff", fontSize: 20 }} />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <Text type="secondary">Masa Aktif:</Text>
                  <br />
                  <Tag color="blue" style={{ marginTop: 4 }}>
                    {pkg.validity}
                  </Tag>
                </div>

                <div
                  style={{
                    borderTop: "1px dashed #eaeaea",
                    paddingTop: 10,
                    marginTop: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text type="secondary">Harga:</Text>
                  <Text strong style={{ color: "#1890ff", fontSize: 16 }}>
                    Rp {pkg.price.toLocaleString("id-ID")}
                  </Text>
                </div>

                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  block
                  style={{
                    marginTop: 16,
                    borderRadius: 8,
                    backgroundColor: "#1890ff",
                    boxShadow: "0 3px 8px rgba(24,144,255,0.3)",
                  }}
                  onClick={() => handleBuy(pkg)}
                >
                  Beli Sekarang
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal Pembelian */}
      <PurchaseForm
        visible={visible}
        onClose={() => setVisible(false)}
        pkg={selectedPkg}
        user={user}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
