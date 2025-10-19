import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Col,
  Typography,
  Popconfirm,
  Empty,
} from "antd";
import {
  WifiOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import api from "../api/api";

const { Title, Text } = Typography;

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/packages");
      setPackages(res.data);
    } catch (err) {
      message.error("Gagal memuat data paket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editing) {
        await api.put(`/packages/${editing.id}`, values);
        message.success("Paket berhasil diperbarui");
      } else {
        await api.post("/packages", values);
        message.success("Paket baru berhasil ditambahkan");
      }
      setIsModalOpen(false);
      setEditing(null);
      fetchPackages();
    } catch {
      message.error("Gagal menyimpan paket");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/packages/${id}`);
      message.success("Paket berhasil dihapus");
      fetchPackages();
    } catch {
      message.error("Gagal menghapus paket");
    }
  };

  return (
    <div
      style={{
        paddingBottom: 60,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f6f9ff 0%, #ffffff 100%)",
        padding: "24px 16px",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>
            Manajemen Paket Data
          </Title>
          <Text type="secondary">
            Tambah, ubah, atau hapus paket data yang tersedia untuk pelanggan.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{
            borderRadius: 8,
            backgroundColor: "#1890ff",
            boxShadow: "0 4px 10px rgba(24, 144, 255, 0.3)",
          }}
          onClick={() => {
            form.resetFields();
            setEditing(null);
            setIsModalOpen(true);
          }}
        >
          Tambah Paket
        </Button>
      </div>

      {/* Cards Section */}
      {packages.length === 0 ? (
        <Empty description="Belum ada paket data" style={{ marginTop: 60 }} />
      ) : (
        <Row gutter={[20, 20]}>
          {packages.map((pkg) => (
            <Col xs={24} sm={12} md={8} lg={6} key={pkg.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  background: "#ffffff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                }}
                bodyStyle={{ padding: "18px 20px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Text strong style={{ fontSize: 16 }}>
                    {pkg.name}
                  </Text>
                  <WifiOutlined style={{ fontSize: 20, color: "#1890ff" }} />
                </div>

                <Text type="secondary">Masa Aktif:</Text>
                <br />
                <Text strong>{pkg.validity}</Text>

                <div
                  style={{
                    marginTop: 10,
                    borderTop: "1px dashed #e5e5e5",
                    paddingTop: 10,
                  }}
                >
                  <Text type="secondary">Harga</Text>
                  <Title
                    level={4}
                    style={{
                      color: "#1890ff",
                      margin: 0,
                      marginTop: 4,
                      fontWeight: 700,
                    }}
                  >
                    Rp {pkg.price.toLocaleString("id-ID")}
                  </Title>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 16,
                  }}
                >
                  <Button
                    icon={<EditOutlined />}
                    type="default"
                    size="small"
                    onClick={() => {
                      setEditing(pkg);
                      form.setFieldsValue(pkg);
                      setIsModalOpen(true);
                    }}
                    style={{ borderRadius: 6 }}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Hapus paket ini?"
                    onConfirm={() => handleDelete(pkg.id)}
                    okText="Ya"
                    cancelText="Batal"
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      style={{ borderRadius: 6 }}
                    >
                      Hapus
                    </Button>
                  </Popconfirm>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal Tambah/Edit Paket */}
      <Modal
        open={isModalOpen}
        title={editing ? "Edit Paket Data" : "Tambah Paket Baru"}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editing ? "Simpan Perubahan" : "Tambahkan"}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Nama Paket"
            rules={[{ required: true, message: "Nama paket wajib diisi" }]}
          >
            <Input placeholder="Contoh: Paket 10GB (30 hari)" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Harga (Rp)"
            rules={[{ required: true, message: "Harga wajib diisi" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1000}
              step={1000}
              placeholder="Contoh: 45000"
            />
          </Form.Item>
          <Form.Item
            name="validity"
            label="Masa Aktif"
            rules={[{ required: true, message: "Masa aktif wajib diisi" }]}
          >
            <Input placeholder="Contoh: 30 hari" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
