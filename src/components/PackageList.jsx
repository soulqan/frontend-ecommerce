// src/components/PackageList.jsx
import React from 'react';
import { Card, Row, Col, Button } from 'antd';

export default function PackageList({ packages, onBuy }) {
  return (
    <Row gutter={[16, 16]}>
      {packages.map(p => (
        <Col xs={24} sm={12} md={8} key={p.id}>
          <Card title={p.name} extra={<div>{p.validity}</div>}>
            <p>Harga: Rp {p.price.toLocaleString()}</p>
            <Button type="primary" onClick={() => onBuy(p)}>Beli</Button>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
