import React, { useState } from "react";
import { Form, Input, Button, message, Typography, Row, Col, Card } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const { Title } = Typography;

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    api
      .post("users/register", {
        username: values.username,
        email: values.email,
        password: values.password,
      })
      .then((response) => {
        message.success("Posted!");
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        message.error(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Row justify="center" align="middle" style={{ "margin-top": "100px" }}>
      <Col span={8}>
        <Card
          style={{
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            background: "#333",
            color: "#fff",
          }}
        >
          <Form name="registration" onFinish={onFinish} layout="vertical">
            <Title level={2}>Registro</Title>
            <Form.Item
              name="username"
              label="Usuario"
              rules={[
                { required: true, message: "Por favor ingresa un usuario" },
                {
                  min: 4,
                  message: "El usuario debe tener al menos 4 caracteres",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Correo Electrónico"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa un correo electrónico",
                },
                {
                  type: "email",
                  message: "Por favor ingresa un correo electrónico válido",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Contraseña"
              rules={[
                { required: true, message: "Por favor ingresa una contraseña" },
                {
                  min: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Registrarse
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default RegistrationForm;
