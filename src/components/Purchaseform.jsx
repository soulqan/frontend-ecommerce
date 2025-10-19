import React, { useState } from "react";
import { Modal, Form, Input, Select, message, Steps, Button } from "antd";
import api from "../api/api";

const { Step } = Steps;

export default function PurchaseForm({ visible, onClose, pkg, user, onSuccess }) {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔹 Step 1 → lanjut ke Step 2
  const handleNext = async () => {
    try {
      const values = await form.validateFields(["phone"]);
      // Pastikan nomor tersimpan agar tidak hilang di step berikutnya
      form.setFieldsValue({ phone: values.phone });
      message.success("Nomor telepon disimpan. Lanjut ke pembayaran ✅");
      setStep(1);
    } catch {
      message.warning("Mohon isi nomor telepon dengan benar sebelum melanjutkan");
    }
  };

  // 🔹 Step 2 → kirim transaksi ke server
  const handlePayment = async () => {
    try {
      const values = await form.validateFields(["paymentMethod", "phone"]);
      const { phone, paymentMethod } = values;

      setLoading(true);

      const payload = {
        userId: user.id,
        packageId: pkg.id,
        phone,
        paymentMethod,
        date: new Date().toISOString(),
        status: "pending",
      };

      console.log("📦 Payload dikirim:", payload);

      const res = await api.post("/transactions", payload);
      message.success("Transaksi berhasil dibuat! Menunggu konfirmasi pembayaran.");

      onSuccess(res.data);
      form.resetFields();
      setStep(0);
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Gagal membuat transaksi");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Kembali ke step sebelumnya
  const handlePrev = () => setStep(0);

  // 🔹 Reset ketika modal ditutup
  const handleCancel = () => {
    setStep(0);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null}
      centered
      title={
        <div style={{ textAlign: "center" }}>
          <strong>Beli {pkg?.name || "Paket Data"}</strong>
        </div>
      }
    >
      {/* Step Indicator */}
      <Steps
        current={step}
        size="small"
        style={{
          marginBottom: 24,
          maxWidth: 400,
          marginInline: "auto",
        }}
      >
        <Step title="Data Pembelian" />
        <Step title="Metode Pembayaran" />
      </Steps>

      {/* Step 1: Nomor Telepon */}
      {step === 0 && (
        <Form
          form={form}
          layout="vertical"
          preserve={true}
          style={{ padding: "0 10px" }}
        >
          <Form.Item
            label="Nomor Telepon"
            name="phone"
            preserve={true}
            rules={[
              { required: true, message: "Masukkan nomor telepon" },
              {
                pattern: /^08[0-9]{8,11}$/,
                message: "Nomor harus diawali 08 dan 10–13 digit",
              },
            ]}
          >
            <Input
              placeholder="08xxxxxxxxxx"
              maxLength={13}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Button
            type="primary"
            block
            onClick={handleNext}
            style={{
              borderRadius: 8,
              boxShadow: "0 3px 8px rgba(24,144,255,0.3)",
            }}
          >
            Lanjutkan Pembayaran
          </Button>
        </Form>
      )}

      {/* Step 2: Metode Pembayaran */}
      {step === 1 && (
        <Form
          form={form}
          layout="vertical"
          preserve={true}
          style={{ padding: "0 10px" }}
          onFinish={handlePayment}
        >
          <Form.Item
            label="Metode Pembayaran"
            name="paymentMethod"
            rules={[{ required: true, message: "Pilih metode pembayaran" }]}
          >
            <Select
              placeholder="Pilih metode pembayaran"
              style={{ borderRadius: 8 }}
            >
              <Select.Option value="DANA">DANA</Select.Option>
              <Select.Option value="OVO">OVO</Select.Option>
              <Select.Option value="GoPay">GoPay</Select.Option>
              <Select.Option value="Transfer Bank">Transfer Bank</Select.Option>
              <Select.Option value="Pulsa">Pulsa</Select.Option>
            </Select>
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Button onClick={handlePrev} style={{ borderRadius: 8 }}>
              Kembali
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                borderRadius: 8,
                boxShadow: "0 3px 8px rgba(24,144,255,0.3)",
              }}
            >
              Bayar Sekarang
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
}
